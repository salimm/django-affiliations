from django.core.mail import send_mail
import string
import random

from django.conf import settings

def createEmailBody(request,aff):
	tmp = """Dear """+request.user.get_full_name()+"""
		Your confirmation code to confirm your affiliation at """ +aff.org+""" is:

		"""+aff.token+"""

		Use this code to confirm your affiliation at 
		"""+settings.AFFILIATIONS_URL+"""

		Sincerely,
		Admin
	"""
	return tmp

def sendEmail(request,aff):
	body = createEmailBody(request,aff)
	email = aff.account+"@"+aff.org
	if not settings.AFFILIATIONS_CODE_SUBJECT:
		subject = "Confirmation Code"
	subject = settings.AFFILIATIONS_CODE_SUBJECT	
	fromemail =settings.AFFILIATIONS_FROM_EMAIL	
	send_mail(subject, body, fromemail,[email], fail_silently=False)	

def updateAffiliationCode(aff):
	token=''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(12)])
	aff.token=token
	aff.save()