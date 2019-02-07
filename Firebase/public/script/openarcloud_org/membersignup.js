
 
let oarc = {};


 // FORM ADJUSTMENT 
 oarc.addCountries =  (whereto)=>{
  var countriesfile = "Afghanistan, Albania, Algeria, American Samoa, Andorra, Angola, Anguilla, Antarctica, Antigua and Barbuda, Argentina, Armenia, Aruba, Australia, Austria, Azerbaijan, Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bermuda, Bhutan, Bolivia, Bosnia and Herzegovina, Botswana, Bouvet Island, Brazil, British Indian Ocean Territory, Brunei Darussalam, Bulgaria, Burkina Faso, Burundi, Cambodia, Cameroon, Canada, Cape Verde, Cayman Islands, Central African Republic, Chad, Chile, China, Christmas Island, Cocos (Keeling Islands), Colombia, Comoros, Congo, Cook Islands, Costa Rica, Cote D'Ivoire (Ivory Coast), Croatia (Hrvatska, Cuba, Cyprus, Czech Republic, Denmark, Djibouti, Dominica, Dominican Republic, East Timor, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia, Ethiopia, Falkland Islands (Malvinas), Faroe Islands, Fiji, Finland, France, France, Metropolitan, French Guiana, French Polynesia, French Southern Territories, Gabon, Gambia, Georgia, Germany, Ghana, Gibraltar, Greece, Greenland, Grenada, Guadeloupe, Guam, Guatemala, Guinea, Guinea-Bissau, Guyana, Haiti, Heard and McDonald Islands, Honduras, Hong Kong, Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy, Jamaica, Japan, Jordan, Kazakhstan, Kenya, Kiribati, Korea (North), Korea (South), Kuwait, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein, Lithuania, Luxembourg, Macau, Macedonia, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Martinique, Mauritania, Mauritius, Mayotte, Mexico, Micronesia, Moldova, Monaco, Mongolia, Montserrat, Morocco, Mozambique, Myanmar, Namibia, Nauru, Nepal, Netherlands, Netherlands Antilles, New Caledonia, New Zealand, Nicaragua, Niger, Nigeria, Niue, Norfolk Island, Northern Mariana Islands, Norway, Oman, Pakistan, Palau, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Pitcairn, Poland, Portugal, Puerto Rico, Qatar, Reunion, Romania, Russian Federation, Rwanda, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and The Grenadines, Samoa, San Marino, Sao Tome and Principe, Saudi Arabia, Senegal, Seychelles, Sierra Leone, Singapore, Slovak Republic, Slovenia, Solomon Islands, Somalia, South Africa, S. Georgia and S. Sandwich Isls., Spain, Sri Lanka, St. Helena, St. Pierre and Miquelon, Sudan, Suriname, Svalbard and Jan Mayen Islands, Swaziland, Sweden, Switzerland, Syria, Taiwan, Tajikistan, Tanzania, Thailand, Togo, Tokelau, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Turks and Caicos Islands, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom (Britain / UK), United States of America (USA), US Minor Outlying Islands, Uruguay, Uzbekistan, Vanuatu, Vatican City State (Holy See), Venezuela, Viet Nam, Virgin Islands (British), Virgin Islands (US), Wallis and Futuna Islands, Western Sahara, Yemen, Yugoslavia, Zaire, Zambia, Zimbabwe";
  var countries = countriesfile.split(',');
  var select = document.getElementById(whereto);
  select.innerHTML  = '';
  if(select){
  
    for(var c = 0; c<countries.length; c++) {
      var option = document.createElement("option");
      option.value = countries[c];
      option.innerHTML  = countries[c];
      select.append(option);
      //$(whereto).append('<option value="' + countries[c] + '">' + countries[c] + '</option>');
    }
  }
};


oarc.getFormFields = ()=>{
    let formFieldIds = ["member_type_pro","member_type_other","first-name","last-name", "birthyear", "address","postcode_or_zip", "city","country", "email","password","organization","jobtitle","linkedin","accept_memberterms","accept_ip_bylaws"]
  
    return formFieldIds.map((id)=>{
          return document.getElementById(id);
    });
  };




oarc.enableSignup = ()=>{
    // MEMBER SIGNUP
    let signupBtn = document.querySelector("#member_signup_gopay");

    signupBtn.onclick = (e) => {
    let isOk = true;
    formFields.forEach((el)=>{
        if(!el.checkValidity()){
        isOk = false;
        el.reportValidity();
        }
        });
    
    if(isOk){
        console.log("ready to submit data");
        // do the stuff!
        let spinner = document.getElementById('spinner');
        spinner.style.display='inline-block';

        if(firebase){
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password).then((res) =>{
        
        //console.log(res);
        // ready to update member
        
        let postcode_or_zip = document.getElementById("postcode_or_zip")? document.getElementById("postcode_or_zip").value : undefined;
        let jobtitle = document.getElementById("jobtitle") ? document.getElementById("jobtitle").value : undefined;
        let linkedin = document.getElementById("linkedin") ? document.getElementById("linkedin").value : undefined;
        let membertype = document.getElementById("member_type_pro").checked ? "professional" : "studentparttimeother";
        let organizations = document.getElementById("organization") ? document.getElementById("organization").value : undefined;
        

        let member = {
            membertype: membertype,
            personal_details : {
            city:document.getElementById("city").value,
            firstname: document.getElementById("first-name").value,
            lastname: document.getElementById("last-name").value,
            yearofbirth: parseInt(document.getElementById("birthyear").value),
            streetaddress: document.getElementById("address").value,
            email: document.getElementById("email").value,
            linkedin: linkedin,
            postcodeorzip: postcode_or_zip,
            organizations: organizations,
            jobtitleorrole: jobtitle
            
            }
        };

        
        let uid = res.user.uid;
    
        let signgupform = document.getElementById('signupform');

        // confirmation step elements
        let confirmationstep= document.getElementById('confirmationstep');
        let confirmationinfo = document.getElementById('confirmationinfo');
        let confirmationinfoheading = document.getElementById('confirmationinfoheading');
        let resendconfirmationbtn = document.getElementById('confirmationinfoheading');
        let emailVerified = false;
        let retries = 50;
        let interval = 3000;

        // payment step elements

        let paymentstep = document.getElementById('paymentstep');


        let checkVerified = ()=>{
            let user = firebase.auth().currentUser;
            user.reload().then((x)=>{
            
            if(user.emailVerified){
                emailVerified = true;
                confirmationstep.style.display = 'none';
                paymentstep.style.display = 'block';
                enablePayment();
                console.log("email was verified!");
                // show email verified - proceed to payment
            } else {
                retries --;
                if(retries >0){
                console.log("Check again! remaining retries: "+retries );
        
                setTimeout(checkVerified, interval) ;
                } else {
                // display check again button ?
                console.log("No remaining retries " );

                }
            }
        }).catch((err)=>{console.log(err)});
        }



        let sendConfirmationEmail = ()=>{
            let user = firebase.auth().currentUser;
                user.sendEmailVerification().then(()=>{
                retries = 50;
                setTimeout(checkVerified, interval);
                }).catch((err)=>{
                });
        }

        
        firebase.database().ref('members/'+uid).update(member,
            (error) =>{
            if (error) {
                // The write failed...
                console.log("failed to save top-level member data");
            } else {
                // Data saved successfully!
                console.log("successfully saved top-level member data!");
                
                let user = firebase.auth().currentUser;
                // listen to email verification
                
                // send emailverification
                user.sendEmailVerification().then(()=>{
                console.log("Sendt email verification email!");
                console.log("waiting for confirmation");
                signgupform.style.display = 'none';
                confirmationstep.style.display = 'block';
                setTimeout(checkVerified, interval);

                }).catch((err)=>{
                let  signgupformerror = document.getElementById('signgupformerror');
                signgupformerror.style.display = "block";
                spinner.style.display='none';
                });

            }
            });
        
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            spinner.style.display='none';
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            });
        }
        
    } else {
        console.log("form is not valid");
    }

    }

    let useStripeCard = (usdAmount, feeType, container)=>{

    let stripeCardTemplate = `<form action="your-server-side-code" method="POST">
            <script
            src="https://checkout.stripe.com/checkout.js" class="stripe-button"
            data-key="pk_test_TYooMQauvdEDq54NiTphI7jx"
            data-amount="${usdAmoun*100}"
            data-name="Stripe.com"
            data-description="${feeType}"
            data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
            data-locale="auto"
            data-zip-code="true">
            </script>
        </form>`

        container.innerHTML = stripeCardTemplate;
    };

    let enablePayments = ()=>{


    let paymentarea = document.getElementById('paymentarea');
    
    let paycardbtn = document.getElementById('paycardbtn');
    paycardbtn.onclick = ()=>{useStripeCard(1,"membership_fee", paymentarea)};


    };
};


oarc.addCountries('country');
let formFields = oarc.getFormFields();
oarc.enableSignup();


