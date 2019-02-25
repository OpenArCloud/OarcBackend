
 
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
      option.value = countries[c].trim();
      option.innerHTML  = countries[c];
      select.append(option);
      //$(whereto).append('<option value="' + countries[c] + '">' + countries[c] + '</option>');
    }
  }
};

oarc.signupState = {};

oarc.blurFunc = (e)=>{
    if(window.localStorage){ // no need to do anything without ls
        if(e && e.srcElement){
            let el = e.srcElement
            if(el.type == "radio" || el.type == "checkbox"){
                oarc.signupState[el.id] = el.checked;
            }else {
                oarc.signupState[el.id] = el.value;
            }
            window.localStorage.setItem('signupState', JSON.stringify(oarc.signupState));// store updated value
        }  
    }
}

oarc.getFormFields = ()=>{
    let formFieldIds = ["member_type_pro","member_type_other","first-name","last-name", "birthyear", "address","postcode_or_zip", "city","country", "email","password","organization","jobtitle","linkedin","accept_memberterms","accept_ip_bylaws"]
    return formFieldIds.map((id)=>{
        let el = document.getElementById(id);
        el.addEventListener('blur', oarc.blurFunc); // ensures we can save changes to all our formfields
        return el;
    });
};

oarc.logErrorToRTDB = (error, errorMessage, uid)=>{
    if(firebase.database()){
        
        let path  = uid ? '/client_errors/user/'+uid: '/client_errors/unidentified';
        let ref = firebase.database().ref(path);
        let errorObj = {
            error: error,
            errorMessage: errorMessage,
            timestamp: Date.now()
        };
        let errorRef =  newMessageRef = ref.push();
        errorRef.set(errorObj);
    }
}


oarc.enableSignup = ()=>{

    let formFields = oarc.getFormFields();

    // Check state cache
    if(window.localStorage){
        console.log("checks local storage");
        let s = window.localStorage.getItem('signupState');

        oarc.signupState =  s ? JSON.parse(s) : oarc.signupState ; 
        let st =  oarc.signupState
        console.log(st);

        // set field values from "cache"
        formFields.forEach((field)=>{
            field.value = st[field.id] ? st[field.id] : '';

            if(field.type == "radio" || field.type == "checkbox"){
                field.checked = st[field.id];
            }else {
                field.value = st[field.id] ? st[field.id] : '';
            }
        });
        
    }


    // MEMBER SIGNUP
    let signupBtn = document.querySelector("#member_signup_gopay");
    let interval = 3000; // retry interval for the email verification
    let retries = 60 // number of times to  retry email verification check
    
    
    
    
    signupBtn.onclick = (e) => {
        signupBtn.disabled = true;
        let isOk = true;
        
        
    
        if(isOk){
            // first store the fields in the cache
            if(window.localStorage){
                console.log("checks local storage");
                let storage = window.localStorage;
            }


            console.log("ready to submit data");
            let spinner = document.getElementById('spinner');
            spinner.style.display='inline-block';

            // CREATE ONLINE USER
            if(firebase){
                let email = document.getElementById("email").value;
                let password = document.getElementById("password").value;

                    // PREPARE MEMBER DETAILS
                let postcode_or_zip = document.getElementById("postcode_or_zip")? document.getElementById("postcode_or_zip").value : undefined;
                let jobtitle = document.getElementById("jobtitle") ? document.getElementById("jobtitle").value : undefined;
                let linkedin = document.getElementById("linkedin") ? document.getElementById("linkedin").value : undefined;
                let membertype = document.getElementById("member_type_pro").checked ? "professional" : "studentparttimeother";
                let organizations = document.getElementById("organization") ? document.getElementById("organization").value : undefined;

                let personal_details = {
                    city:document.getElementById("city").value,
                    country:document.getElementById("country").value,
                    firstname: document.getElementById("first-name").value,
                    lastname: document.getElementById("last-name").value,
                    yearofbirth: parseInt(document.getElementById("birthyear").value),
                    streetaddress: document.getElementById("address").value,
                    email: document.getElementById("email").value,
                    linkedin: linkedin,
                    postcodeorzip: postcode_or_zip,
                    organizations: organizations,
                    jobtitleorrole: jobtitle,
                    membertype:membertype
                };                    

                firebase.auth().createUserWithEmailAndPassword(email, password).then((res) =>{                        
                    if(res) {
                        //user is created, let's listen for the corresponding record being created in RTDB 
                        listenForSignupCompleted(personal_details);
                    }                                                                            
                }).catch(function(error) { // catch firebase member creation error
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    spinner.style.display='none';
                    signupBtn.disabled = false;
                    if (errorCode == 'auth/weak-password') {
                        alert('The password is too weak.');
                        oarc.logErrorToRTDB(error, 'Error during member password is too weak:  ' + error.message);
                    } else {
                        alert(errorMessage);
                        oarc.logErrorToRTDB(error, 'Error during member creation:  ' + error.message);
                    }
                    console.log(error);
   

                });
            }
        
        } else {
            // form wasn not validated
            console.log("form is not valid");
        }
    }

    let listenForSignupCompleted = (personal_details)=>{
        let user = firebase.auth().currentUser;
        let path = 'members/'+user.uid;

        
        console.log("Checking if we have a member record created for uid "+ user.uid);
        firebase.database().ref(path).on('child_added',(s)=>{
            console.log(s);
            //if(s.node_ && s.node_.children_ && s.node_.children_.root_ && s.node_.children_.root_.value){
            if(s.exists() && s.val()){                
                //ok we have a member record created by onUserCreate() in RTDB.
                //Detach the listener first as it gets called for each child under /members/uid
                firebase.database().ref(path).off('child_added');

                let uid = user.uid;                
                
                let memberUpdate ={}
                //memberUpdate['members/'+uid+'/membertype'] = membertype;
                memberUpdate['members/'+uid+'/personal_details'] =personal_details; 


                let signgupform = document.getElementById('signupform');

                // confirmation step elements
                let confirmationstep= document.getElementById('confirmationstep');
                let emailverificationerror = document.getElementById('emailverificationerror');
                let emailverificationerrormessage = document.getElementById('emailverificationerrormessage');
            
                //Safe to update the member record now, since onUserCreate() has already finished with it and 
                //it will not be overwritten
                // FIREBASE MEMBER UPDATE
                firebase.database().ref().update(memberUpdate,
                    (error) =>{
                        if (error) {
                            // The write failed...
                            console.log("failed to save top-level member data");
                        } else {
                            // Data saved successfully!
                            console.log("successfully saved top-level member data!");
                            
                            // listen to email verification
                            console.log("after calling firebase.auth().currentUser.  uid: "+ user.uid);
                            
                            // send emailverification
                            user.sendEmailVerification().then(()=>{
                                console.log("Sendt email verification email!");
                                console.log("waiting for confirmation");
                                signgupform.style.display = 'none';
                                confirmationstep.style.display = 'block';
                                setTimeout(checkVerified, interval);

                            }).catch((err)=>{
                                console.log(err);
                                
                                emailverificationerror.style.display = 'block'
                                emailverificationerrormessage.innerHTML = "There was an error: Email verification has not been sent! You could try again"
                                
                                spinner.style.display='none';

                                oarc.logErrorToRTDB(err, 'Verification email not sent:  ' + err.message, user.uid);
                            });

                        }
                    }
                );
            } 

        });

        // EMAIL VERIFICATION
        let checkVerified = ()=>{            
            user.reload().then(()=>{
                console.log("reloaded user:");
                if(user.emailVerified){
                    emailVerified = true;
                    confirmationstep.style.display = 'none';
                    paymentstep.style.display = 'block';
                    enablePayments();
                    console.log("email was verified!");
                    // show email verified - proceed to payment
                } else {
                    retries --;
                    if(retries >0){
                    console.log("Check again! remaining retries: "+retries );
            
                    setTimeout(checkVerified, interval) ;
                    } else {
                        //confirmationinfo
                    let confirmationinfo = document.getElementById("confirmationinfo");
                    confirmationinfo.innerHTML = '<b style="color:red;">Your email verification attempt timed out</b>';
                    // display check again button ?
                    console.log("No remaining retries " );
                    oarc.logErrorToRTDB({}, 'Timeout for email verification No remaining retries', user.uid);

                    }
                }
        }).catch((err)=>{
            console.log(err);
            oarc.logErrorToRTDB(err, 'Error with email verifiaction', user.uid);
        });
        
    };

    
    let sendConfirmationEmail = ()=>{
        let user = firebase.auth().currentUser;
        user.sendEmailVerification().then(()=>{
            retries = 50;
            setTimeout(checkVerified, interval);
        }).catch((err)=>{
            oarc.logErrorToRTDB(err, 'Error with confirmation email', user.uid);
        });
    }

    }

    let useStripeCard = ( container)=>{

    let stripeCardTemplate = `<form action="/charge" method="post" id="payment-form">
            <div class="form-row">
            <label for="card-element">
                Credit or debit card
            </label>
            <div id="card-element">
                <!-- A Stripe Element will be inserted here. -->
            </div>
        
            <!-- Used to display form errors. -->
            <div id="card-errors" role="alert"></div>
            </div>
        
            <button class="card_payment_button">Submit Payment</button>
        </form>`

        container.innerHTML = stripeCardTemplate;
    };


    

    let enablePayments = ()=>{
        
        
        let paymentarea = document.getElementById('paymentarea');
        let paycardbtn = document.getElementById('paycardbtn');
        let paymentconfirmed = document.getElementById("paymentconfirmed");

        let listenForChargeConfirmed = (tokenid)=>{
            let user = firebase.auth().currentUser;
            let path = 'members/'+user.uid+'/payment_resp'
            //let path = '/members/'+user.uid+'/payment_info/';
            console.log("when checking if charge is confirmed - uid "+ user.uid);
            firebase.database().ref(path).on('child_added',(s)=>{
                console.log(s);
                //if(s.node_ && s.node_.children_ && s.node_.children_.root_ && s.node_.children_.root_.value){
                if(s.exists() && s.val()){
                    //console.log(s.node_.children_.root_.value);
                    //let child = s.node_.children_.root_.value;
                    let child = s.val();
                    if(child!= null){
                        let t = child;
    
                        if(t.ok){
                            paymentconfirmed.style.display = 'block';
                            paymentconfirmed.innerHTML = '<div> <b style="color:#9bcb3c; font-size:16px">Payment of ' + t.amount + 'USD for the fee completed! You are now a member of Open AR Cloud! </b><a href="/signedin/my-profile" class="oarc-profile">Go to your profile</a></div>';
                        } else {
                            paymentconfirmed.style.display = 'block';
                            paymentconfirmed.innerHTML = '<h2 style="color:red">Payment declined! Try another card.</h2>';
                            oarc.logErrorToRTDB( {chargeresponse:t}, 'Error - payment declined ', user.uid);

                        }
    
                    }
                } else {
                    oarc.logErrorToRTDB(s.error ? s.error : {}, 'Error with /payment_response child element', user.uid);
                }

            });
            
        };

        paycardbtn.onclick = ()=>{
            let user_uid = firebase.auth().currentUser.uid;
            useStripeCard(paymentarea);
            //var stripe = Stripe('pk_live_Y7gUPLvMqjjp8SFDNBPDFG62');
            var stripe = Stripe('pk_test_SF8tZucaqbkF7FAwDQ0tBDUC');
            var elements = stripe.elements();
            // Custom styling can be passed to options when creating an Element.
            // (Note that this demo uses a wider set of styles than the guide below.)
            var style = {
                base: {
                color: '#32325d',
                lineHeight: '18px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
                },
                invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
                }
            };

            // Create an instance of the card Element.
            var card = elements.create('card', {style: style});
            

            // Add an instance of the card Element into the `card-element` <div>.
            card.mount('#card-element');

            // Handle real-time validation errors from the card Element.
            card.addEventListener('change', function(event) {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                displayError.textContent = event.error.message;

                } else {
                displayError.textContent = '';
                }
            });

            // Handle form submission.
            var form = document.getElementById('payment-form');
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                stripe.createToken(card).then(function(result) {
                    if (result.error) {
                        // Inform the user if there was an error.
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                        oarc.logErrorToRTDB(result.error, "card not validated" + result.error.message, user_uid)
                    } else {
                        // Send the token to your server.
                        //stripeTokenHandler(result.token);
           
                        console.log("Card details accepted.");
                        let user = firebase.auth().currentUser;
                        let payment_info = {
                            token:result.token,
                            timestamp:Date.now()
                        }
                        let path = '/members/'+user.uid+'/payment_info';
                        console.log("when token was created -   uid: "+ user.uid);
                        firebase.database().ref(path).update(payment_info).then((error) =>{
                                if (error) {
                                    // The write failed...
                                    console.log("failed to submit payment data");
                                    paymentconfirmed.style.display = 'block';
                                    paymentconfirmed.innerHTML = '<b style="color:red" >Failed to submit payment data!</b>';
                                    oarc.logErrorToRTDB(error, 'Error when updating "payment_info"', user_uid);
                                } else {
                                    // Data saved successfully!
                                    console.log("payment details submitted");
                                    paymentconfirmed.style.display = 'block';
                                    paymentconfirmed.innerHTML = '<h2>Paymentdetails submitted</h2>';
                                    // TODO: Listen for payment confirmed
                                    listenForChargeConfirmed(result.token.id);    
                                }
                        });
                        
                    }
                });
            });


            


        };
    };
}


//oarc.addCountries('country');

//let formFields = oarc.getFormFields();
//oarc.enableSignup();


