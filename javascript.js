const wrapper=document.querySelector(".wrapper"),
inputPart=wrapper.querySelector(".input-part"),
infoTxt=inputPart.querySelector(".info-txt"),
inputField=inputPart.querySelector("input"),
locationBtn=inputPart.querySelector("button"),
wIcon=wrapper.querySelector(".weather-part img"),
arrowBack=wrapper.querySelector("header i");

const apiKey='YourApı';  //OpenWeatherMap API anahtarınızı alın
const translateApiKey=`YourApi` //googletranslate api anahtarinizi alin

let api;



inputField.addEventListener("keyup", e=>{

    if(e.key=="Enter" && inputField.value!=""){
       requestApi(inputField.value);
    }
});



locationBtn.addEventListener("click",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSucces,onError);

    }else{
        alert("Tarayıcınız geolacation uygulamasını desteklemiyor");
    }
})

function onSucces(position)
{
    const{latitude,longitude}=position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error)
{
    infoTxt.innerText=error.message;
    infoTxt.classList.add("error");
}




function requestApi(city){
 api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
fetchData();
}

function fetchData(){
infoTxt.innerText="hava durumu bilgilerini aliyoruz...";
infoTxt.classList.add("pending");
fetch(api).then(response=>response.json()).then(result=>weatherDetails(result));
}





arrowBack.addEventListener("click", ()=>{
    inputField.value = "";
    wrapper.classList.remove("active");
    
})

function weatherDetails(info) {
  

    
    infoTxt.classList.replace("pending","error");
    if(info.cod=="404"){
        
        infoTxt.innerText=`${inputField.value} Geçerli şehir adı değil`;
    }else{

    const city=info.name;
    const country=info.sys.country;
    const{feels_like}=info.main;
    const{temp}=info.main;
    const{humidity}=info.main;


    const { description, id } = info.weather[0];

    // Google Translate API'sını kullanarak çeviri yapma işlemi
    const lang = 'tr'; 
    const url = `https://translation.googleapis.com/language/translate/v2?key=${translateApiKey}&q=${encodeURIComponent(description)}&target=${lang}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.translations && data.data.translations.length > 0) {
                const translatedDescription = data.data.translations[0].translatedText;
                const capitalizedDescription = translatedDescription.charAt(0).toUpperCase() + translatedDescription.slice(1);
                wrapper.querySelector(".weather").innerText=`${capitalizedDescription}`;
            } else {
                console.error('Çeviri başarısız oldu.');
            }
        })
        .catch(error => {
            console.error('Çeviri yapılırken bir hata oluştu:', error);
        });

   

    
    if(id==800){
        wIcon.src="Icons/clear.svg";
    }else if(id>=200 && id<=232){
        wIcon.src="Icons/strom.svg";
    }else if(id>=600 && id<=622){
        wIcon.src="Icons/snow.svg";
    }else if(id>=701 && id<=781){
        wIcon.src="Icons/haze.svg";
    }else if(id>=801 && id<=804){
        wIcon.src="Icons/cloud.svg";
    }else if((id>=300 && id<=321)||(id>=500 && id<=531)) {
        wIcon.src="Icons/rain.svg";
    }

   

    wrapper.querySelector(".location span").innerText=`${city}, ${country}`;
  
    wrapper.querySelector(".temp .numb-2").innerText=Math.floor(feels_like);
    wrapper.querySelector(".temp .numb").innerText=Math.floor(temp);
    wrapper.querySelector(".humidity span").innerText=`${humidity}%`;



        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
        console.log(info);
    }
}

