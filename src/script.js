const SOLAR_HEADS = document.querySelectorAll('.solar-head');
const BMI_USC = document.getElementById('bmi-usc');
const CALC_BTN = document.getElementById('calc-btn');
const CLR_BTN = document.getElementById('clr-btn');
let activeForm;

// event listeners
window.addEventListener('DOMContentLoaded', () => {
    BMI_USC.classList.add('show-bmi');
    activeForm = "bmi-usc";
});

CALC_BTN.addEventListener('click', performSolarCalc);
CLR_BTN.addEventListener('click', () => {
    let forms = [...document.forms];
    forms.forEach(form => form.reset());
    clearFtn();
});

function clearFtn(){
    document.getElementById('bmi-value').innerHTML = "";
    document.getElementById('bmi-category').innerHTML = "";
    document.getElementById('bmi-gender').innerHTML = "";
}

// calculation form toggle
SOLAR_HEADS.forEach(bmiHead => {
    bmiHead.addEventListener('click', () => {
        if(bmiHead.id === "bmi-usc-head"){
            removeActiveClass();
            clearFtn();
            bmiHead.classList.add('active-head');
            BMI_SI.classList.remove('show-bmi');
            BMI_USC.classList.add('show-bmi');
            activeForm = "bmi-usc";
        }
        if(bmiHead.id === "bmi-si-head"){
            removeActiveClass();
            clearFtn();
            bmiHead.classList.add('active-head');
            BMI_USC.classList.remove('show-bmi');
            BMI_SI.classList.add('show-bmi');
            activeForm = "bmi-si";
        }
    });
});

// remove active class from heads
function removeActiveClass(){
    SOLAR_HEADS.forEach(bmiHead => {
        bmiHead.classList.remove('active-head');
    });
}

// main bmi calculation function
function performSolarCalc(){
    let SolarInfo = getUserInput();
    if(SolarInfo) SolarSavings(SolarInfo);
}

// get input values
function getUserInput(){
    let status;
    // get input values from us units
    if(activeForm === "solar-c"){
        let age = document.getElementById('age').value,
            homeowner = document.querySelector('#solar-c input[name = "Homeowner"]:checked').value,
            familyMembers = document.getElementById('familyCount').value,
            evCount = document.getElementById('vehicles').value,
            year = document.getElementById('year').value,
            electricVehicle = document.querySelector('#solar-c input[name = "EVOwner"]:checked').value,
            battery = document.querySelector('#solar-c input[name = "Battery"]:checked').value;


        status = checkInputStatus([age, homeowner, familyMembers, evCount, year, electricVehicle, battery]);

        if(status == true){
            return calculateSolar({
                age,
                homeowner,
                familyMembers,
                evCount,
                year,
                electricVehicle,
                battery,
                taxCredit: parseFloat(2022) * 12 + parseFloat(),

            });
        }
    }

    document.querySelector('.alert-error').style.display = "block";
    setTimeout(() => {
        document.querySelector('.alert-error').style.display = "none";
    }, 1000);
    return false;
}

function checkInputStatus(inputs){
    for(let i = 0; i < inputs.length; i++){
        if(inputs[i].trim() === "" || isNaN(inputs[i])) return false;
    }
    return true;
}

// calculate Value
function calculateSolar(values){
    let savings;
    if(activeForm === 'solar-c'){
        savings = (703 * (values.weight / Math.pow(values.height, 2))).toFixed(2);
    } else {
        savings = (values.weight / Math.pow(values.height, 2)).toFixed(2);
    }
    return {gender: values.gender, savings};
}

// print result information
function SolarSavings(SolarInfo){
    document.getElementById('solar-value').innerHTML = `${SolarInfo.savings} kg/m<sup>2</sup>`;

    let SolarCategory;
    if(SolarInfo.savings > 0){
        SolarCategory = "Cost Effective!";
    } else if(SolarInfo.savings < 0){
        SolarCategory = "Not Worth The Costs";
    }

    document.getElementById('solar-category').innerHTML = `${SolarCategory}`;
    document.getElementById('home-owner').innerHTML = SolarInfo.gender;
}