function initAffiliations(){
	fetchAffiliations();
	
	$("#aff-button").click(function(){
		var menuId = $( "ul.nav" ).first().attr( "id" );
		var aff = {};
		aff.email=$("#email").val();
		if(!isValidEmailAddress(aff.email)){
			alert("Not valid email address");
			return;
		}
		aff.aid = aff.email.split("@")[0];
		aff.org = aff.email.split("@")[1];
		aff.confirmed=false;
		var request = $.ajax({
		  url: "/affiliations/add",
		  type: "POST",
		  async: true,
		  success: function(){addAffiliation(aff);},
		  statusCode: {
	        206: function (response) {
	           alert(response);
	        },
	        403: function (response){
	        	alert(response.responseText);	
	        }
	      },
		  error: error_add_affiliation,
		  data: { aid : aff.aid, domain:aff.org,'csrfmiddlewaretoken': $('#token-field').val()},
		  dataType: "html"
		});
	});
}

function fetchAffiliations(){
	var request = $.ajax({
	  url: "/affiliations/fetch",
	  type: "GET",
	  async: true,
	  success: function(affs){		  	
	  	for (var i in affs.list) {
	  		addAffiliation(affs.list[i]);
	  	}
	  },
	  statusCode: {
        206: function (response) {
           alert(response);
        }
      },
	  error: function(e){console.log(e);alert(e.responseText);},
	  dataType: "json"
	});

}

function addAffiliation(aff){

	var cls = "warning";
	var status='<div class="input-group" ><input type="text"  class="form-control " name="Code" placeholder="Enter Code"><span class="input-group-btn"><button id="'+aff.aid+'-'+replaceAll(aff.org,".", "-")+'" class="btn btn-default confirm-button" type="button">Confirm</button><button id="'+aff.aid+'-'+replaceAll(aff.org,".", "-")+'-resendcode" class="btn btn-default confirm-button" type="button" idforaccess="'+aff.aid+'-'+replaceAll(aff.org,".", "-")+'">Resend Code</a></span></div>';
	if(aff.confrimed===true){
		cls="success";
		status="<div style=\"display:inline;\">Confrimed</div>";
	}
	

	$('#aff-table').append('<tr class="'+cls+'"><td>'+escapeHTML(aff.org)+'</td><td>'+escapeHTML(aff.aid)+'</td><td class="col-sm-4">'+status+'</td><td  id="'+aff.aid+'-'+replaceAll(aff.org,".", "-")+'-msg"></td><td></td></tr>');
	$('#'+aff.aid+'-'+replaceAll(aff.org,".", "-")+'-resendcode').click(resendCode);
	$('#'+aff.aid+'-'+replaceAll(aff.org,".", "-")+'').click(sendConfirm);
}

function error_add_affiliation(e){

}

function resendCode(e){

	var request = $.ajax({
		url: "/affiliations/resendcode",
		type: "GET",
		async: true,
		success: function(o){		  	
			$('#'+$(e.target).attr("idforaccess")+'-msg').html('<p class="coderequestmsg" style="font-size:12px; background-color:#99EB99; padding:1px;">New code sent</p>');
			setTimeout(function (){
				$(".coderequestmsg").remove();
			}, 5000);			
		},
		statusCode: {
	        206: function (response) {
	           alert(response);
	        },
	        403: function (response){
	        	alert(response);	
	        }
      	},
		error: function(e){alert(e.responseText);},
		data: { org : $(e.target.parentNode.parentNode.parentNode.parentNode.firstChild).text() ,'csrfmiddlewaretoken': $('#token-field').val() },
		dataType: "text"
	});

}

function sendConfirm(e){
	
	var request = $.ajax({
		url: "/affiliations/confirm",
		type: "POST",
		async: true,
		success: function(o){		  	
			var td= e.target.parentNode.parentNode.parentNode;
			e.target.parentNode.parentNode.remove();
			td.innerHTML="Confirmed";
			td.parentNode.className="success";
		},
		statusCode: {
	        206: function (response) {
	           alert(response);
	        },
	        403: function (response){
	        	alert(response);	
	        }
      	},
		error: function(e){alert(e.responseText);},
		data: { org : $(e.target.parentNode.parentNode.parentNode.parentNode.firstChild).text(),token:e.target.parentNode.parentNode.firstChild.value ,'csrfmiddlewaretoken': $('#token-field').val() },
		dataType: "text"
	});
}
function escapeHTML(s) { 
	return s.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}


function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}