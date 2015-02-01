from django.conf.urls import patterns, include, url
from django.contrib import admin



urlpatterns = patterns('',
    url(r'^$', 'affiliations.views.affiliations', name = 'affiliations_url'),    
    url(r'^fetch', 'affiliations.views.fetch', name = 'aff_fetch_url'),    
    url(r'^add', 'affiliations.views.add', name = 'aff_add_url'),    
    url(r'^confirm', 'affiliations.views.confirm', name = 'aff_confirm_url'),    
    url(r'^resendcode', 'affiliations.views.resendcode', name = 'aff_resendcode_url'),     
)