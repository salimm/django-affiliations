from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.core.urlresolvers import reverse_lazy

import string
import random
import json

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from affiliations.models import Affiliation
from affiliations.utils import *


# @require_http_methods(["GET"])
class AffiliationsView(TemplateView):
    template_name = "affiliations/index.html"

    def get_context_data(self, **kwargs):
        context = super(AffiliationsView, self).get_context_data(**kwargs)
        return context

affiliations = AffiliationsView.as_view();

@require_http_methods(["GET"])
def fetch(request):
    template_name = "affiliations/fetch.html"    
    affs=Affiliation.objects.filter(user=request.user)

    obj = {};
    l= []
    for aff in affs:
        l= l +[{'org':aff.org,'aid':aff.account,'confrimed':(aff.isConfirmed())}]
    obj['list'] = l

    return HttpResponse(json.dumps(obj))	

@require_http_methods(["POST"])
def add(request):
    aid=request.POST['aid']
    domain=request.POST['domain']
    if affExists(user=request.user,org=domain,account=aid):
        return HttpResponse(status=403, content="Affiliation already exists")
    token=''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(12)])
    aff = Affiliation(account=aid, org=domain, token=token, user=request.user)
    aff.save()
    sendEmail(request,aff)
    return HttpResponse(status=201, content="added the affiliation",);

@require_http_methods(["POST"])
def confirm(request):
    user = request.user
    org = request.POST['org']
    token = request.POST['token']
    aff=Affiliation.objects.filter(user=user, org=org)[0]
    if not aff:
        return HttpResponse(status=403,content='Incorrect affiliation!!') 
    # return HttpResponse(aff.token+""+token)
    if(aff.token==token):
        aff.confirm()    
        return HttpResponse("OK")
    else:              
        return HttpResponse(status=403,content='Incorrect token!!')

def affExists(user,org,account):
        return not len(Affiliation.objects.filter(user=user,org=org,account=account))==0


@require_http_methods(["GET"])
def resendcode(request):    
    user = request.user
    org = request.GET['org']
    aff=Affiliation.objects.filter(user=user, org=org)[0]
    if not aff:
        return HttpResponse(status=403,content='Incorrect affiliation!!') 
    updateAffiliationCode(aff=aff)
    sendEmail(request,aff)
    return HttpResponse("OK")
