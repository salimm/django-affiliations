=====
Affiliations
=====

Affiliations is a simple Django application that provides user affiliation management. One common problem of websites is to assure users of who they are. The way users handle this is that they ask them to confirm their emails by submitting a token sent to their emails. However, some websites may need a user to confirm his/her affiliation with many organizations, institutes, schools or companies. Therefore, this package provides an affiliation management interface with help of database and email technology



Quick start
-----------

1. Add "affiliations" to your INSTALLED_APPS setting like this::

    INSTALLED_APPS = (
        ...
        'affiliations',
    )

2. Include the affiliations URLconf in your project urls.py like this::

    url(r'^affiliations/', include('affiliations.urls')),

3. Set the variables below in your settings.py file of your project:

AFFILIATIONS_FROM_EMAIL="email address that you will be sending emails from";
AFFILIATIONS_CODE_SUBJECT = 'subject for your email address'
AFFILIATIONS_URL = 'address to the affiliations webpage';


4. Run `python manage.py migrate` to create the polls models.

5. Depending on your project setup you may need to call the following command to collect all static files in one directory including the JS file

python manage.py collectstatic

6. Start the development server and visit http://127.0.0.1:8000/affiliations/
   to create a affiliations (The user needs to be signed in to do this).

