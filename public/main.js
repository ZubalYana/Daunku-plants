//plants functionality
let db = [];
let cartlist = [];
let totalAmount = 0;
axios.get('http://localhost:3000/plants')
.then((res)=>{
    console.log(res.data)
    for(let el of res.data){
        db.push(el)
        $('.plantsContainer').append(
            `
            <div class="plant">
                <div class="plant_imgCon">
                    <img class="plant_img" src="./imgs/${el.image}">
                    <div class="plant_textCon">
                        <div class="plant_title">${el.title}</div>
                        <div class="plant_rating"></div>
                        <div class="plant_PriceAddCon">
                            <div class="plant_price">$${el.price}.00</div>
                            <div class="plant_addBtn" id="${el._id}">+</div>
                        </div>
                    </div>
                </div>
            </div>
            `
        )

        //Plants rating displaying
        let $ratingContainer = $('.plant_rating').last();
        $ratingContainer.empty();
        for (let i = 0; i < el.rating; i++) {
            $ratingContainer.append(`<i class="fa-solid fa-star"></i>`);
        }
        for (let i = el.rating; i < 5; i++) {
            $ratingContainer.append(`<i class="fa-regular fa-star"></i>`);
        }
    }
    console.log(db)

    $('.plant_addBtn').click((e)=>{
        $('.addingMessage').css('display', 'flex')
        setTimeout(() => {
            $('.addingMessage').css('display', 'none')
        }, 2000);

        let plantID = e.target.id;
        let existingPlant = cartlist.find(plant => plant._id === plantID);

        if (existingPlant) {
            existingPlant.amount++;
        } else {
            let plantToAdd = db.find(plant => plant._id === plantID);
            plantToAdd.amount = 1;
            cartlist.push(plantToAdd);
        }

        renderCart();
    });
});
function renderCart() {
    $('.mainPage_cartCounter').html(cartlist.length);
    $('.chosenPlantsContainer').empty();
    totalAmount = 0;

    cartlist.forEach(plant => {
        $('.chosenPlantsContainer').append(
            `<div class="chosenPlant">
                <img class="chosenPlant_img" src="./imgs/${plant.image}" alt="">
                <div class="chosenPlant_namePriceCon">
                    <div class="chosenPlant_name">${plant.title}</div>
                    <div class="chosenPlant_price">$${plant.price}.00</div>
                </div>
                <div class="chosenPlant_amount">x${plant.amount}</div>
                <div class="chosenPlant_delete" id="deleteFromCart${plant._id}"><div class="minus"></div></div>
            </div>`
        );
        totalAmount += plant.price * plant.amount;
    });

    $('#totalAmount').html(`Total amount: $${totalAmount}.00`);
    $('#chosenPlantCount').html(`Plants chosen: ${cartlist.length}`);
}
$('.mainPage_cart').click(() => {
    $('.cartPopupContainer').css('display', 'flex');
});
$('#cartPopup_xmark').click(() => {
    $('.cartPopupContainer').css('display', 'none');
});

// Hover effects 
$('.chosenPlantsContainer').on('mouseenter', '.chosenPlant_delete', function() {
    $(this).css('background-color', '#081323');
    $(this).find('.minus').css('background-color', '#fff');
}).on('mouseleave', '.chosenPlant_delete', function() {
    $(this).css('background-color', '#fff');
    $(this).find('.minus').css('background-color', '#081323');
});

// Plant deleting from the cartList
$('.chosenPlantsContainer').on('click', '.chosenPlant_delete', function(e) {
    e.stopPropagation();
    let ID = e.target.id;
    if (ID.substring(0, 14) === 'deleteFromCart') {
        let plantID = ID.substring(14);
        let index = cartlist.findIndex(plant => plant._id === plantID);
        if (index !== -1) {
            cartlist.splice(index, 1);
            renderCart();
        }
    }
});


//cookies animation
$('.cookiesJar_con').hover(
    ()=>{
        $('#cookie1').css('top', '80px')
        $('#cookie1').css('left', '0px')
        $('#cookie2').css('top', '50px')
        $('#cookie2').css('left', '100px')
        $('#cookie3').css('top', '55px')
        $('#cookie3').css('left', '40px')
        $('#cookie4').css('top', '110px')
        $('#cookie4').css('left', '20px')
        $('#cookie5').css('top', '100px')
        $('#cookie5').css('left', '60px')
        $('#cookie6').css('top', '120px')
        $('#cookie6').css('left', '100px')
    },
    ()=>{
        $('#cookie1').css('top', '190px')
        $('#cookie1').css('left', '100px')
        $('#cookie2').css('top', '180px')
        $('#cookie2').css('left', '-3px')
        $('#cookie3').css('top', '184px')
        $('#cookie3').css('left', '50px')
        $('#cookie4').css('top', '150px')
        $('#cookie4').css('left', '93px')
        $('#cookie5').css('top', '140px')
        $('#cookie5').css('left', '45px')
        $('#cookie6').css('top', '145px')
        $('#cookie6').css('left', '-5px')
    }
)

//cookies functionality 
$(document).ready(function() {
    checkPopupCookie();
});
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkPopupCookie() {
    const popupClosed = getCookie("popupClosed");
    if (popupClosed === "true") {
        console.log("Popup cookie detected. Closing popup.");
        $(".cookiesPopupContainer").css('display', 'none');
    } else {
        console.log("No popup cookie detected. Showing popup.");
        $(".cookiesPopupContainer").css('display', 'flex');
        
        $("#acceptCookiesBtn").click(function() {
            console.log("Accept cookies button clicked.");
            closePopup();
        });
    }
}
function closePopup() {
    console.log("Closing popup and setting cookie.");
    $(".cookiesPopupContainer").css('display', 'none');
    setCookie("popupClosed", "true", 365);
}

//theme changing
let theme = localStorage.getItem('theme') || 'light';
$('.mainPage_theme').click(function(){
    if(theme == 'light'){
        theme = 'dark';
        localStorage.setItem('theme', theme);
        changeTheme(theme);

    }else{
        theme = 'light';
        localStorage.setItem('theme', theme);
        changeTheme(theme);
    }
})
function changeTheme(theme){
    if(theme == 'light'){
        $('.mainPage_theme').css('justify-content', 'flex-start')
        $('.mainPage_theme').css('background-color', '#fff')
        $('.mainPage_theme_circle').css('background-color', '#283444')
        $('.mainPage_theme_circle').css('border', '2px #fff solid')

    }else{
        $('.mainPage_theme').css('justify-content', 'flex-end')
        $('.mainPage_theme').css('background-color', '#081323')
        $('.mainPage_theme_circle').css('background-color', '#fff')
        $('.mainPage_theme_circle').css('border', '2px #081323 solid')


    }
}
changeTheme(theme);

//contacts changing
axios.get('http://localhost:3000/getContacts')
.then((res)=>{
    console.log(res.data);
    const contacts = res.data;
    contacts.forEach(contact => {
        $('#contacts_address').html(contact.address);
        $('#contacts_email').html(contact.email);
        $('#contacts_phone').html(contact.phone);
    });
})
.catch((err) => {
    console.error(err);
});


//plants ordering
// $('#buyBtn').click(()=>{
//     let data = {
//         userName: $('#userName').val(),
//         userPhone: $('#userPhone').val(),
//         userOrder: cartlist,
//         userName: $('#userName').val(),
//     }
// })