from django.core.mail import send_mail


def createEmailBody(request,aff):
	tmp = """Dear """+request.user.get_full_name()+"""
		Your confirmation code to confirm your affiliation at """ +aff.org+""" is:

		"""+aff.token+"""

		Use this code to confirm your affiliation at 
		http://pittreview/affiliaitons

		Sincerely,
		Admin

	"""
	return tmp

def createEmailBodyHtml(request,aff):
	tmp = """Dear """+request.user.get_full_name()+"""<br/>
		Your confirmation code to confirm your affiliation at <b>""" +aff.org+"""</b> is:
		<br/>
		<b>"""+aff.token+"""</b><br/>
		<br/>
		Use this code to confirm your affiliation at 
		<br/><br/>
		<a href="http://pittreview/affiliaitons">http://pittreview/affiliaitons</a>
		<br/><br/>
		Sincerely,<br/>
		Admin<br/>
	"""
	return tmp

def sendEmail(request,aff):
	body = createEmailBody(request,aff)
	htmlbody = createEmailBodyHtml(request,aff)
	email = aff.account+"@"+aff.org
	subject="Confirmation Code for Pittreview"
	fromemail ="PittReview <dontreply@pittreview.com>"
	
	msg['Subject'] = subject
	msg['From']    = "PittReview <dontreply@pittreview.com>"
	msg['To']      = email

	text = body
	part1 = MIMEText(text, 'plain')

	html = htmlbody
	part2 = MIMEText(html, 'html')

	username = os.environ['admin@pittreview.com']
	password = os.environ['MPFkVUl55j8fBwc9Use']

	msg.attach(part1)
	msg.attach(part2)

	s = smtplib.SMTP('smtp.mandrillapp.com', 587)

	s.login(username, password)
	s.sendmail(msg['From'], msg['To'], msg.as_string())

	s.quit()	
	# send_mail(subject, body, fromemail,[email], fail_silently=False)	


