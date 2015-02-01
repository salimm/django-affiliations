from django.db import models
from django.contrib.auth.models import User

class Affiliation(models.Model):
	# affiliation specific info
	account = models.CharField(max_length=50,db_index=False)
	org = models.CharField(max_length=50,db_index=True)
	# confirmation info
	token = models.CharField(max_length=20,db_index=False)
	# user specific info
	user = models.ForeignKey(User, related_name='userkey')
	

	def  isConfirmed(self):
		return self.token==""

	def  confirm(self):
		self.token=""
		self.save()

		