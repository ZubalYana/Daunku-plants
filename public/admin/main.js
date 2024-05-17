//pages changing
$('.content').append(
    `
    <div class="plantsWrapper">
    <div class="addNewPlantsBtn">+</div>
    <div class="plantslist"></div>
    </div>
    `
)
$('#plants').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '600')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `
        <div class="plantsWrapper">
        <div class="addNewPlantsBtn">+</div>
        <div class="plantslist"></div>
        </div>
        `
    )
    getPlants();

})
$('#contacts').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '600')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `<div class="contactsWrapper">
        <div class="contacts_leftPart">
        <h2>Contacts:</h2>
            <input type="text" class="contacts_input" id="address" placeholder="Address">
            <input type="text" class="contacts_input" id="phone" placeholder="Phone">
            <input type="text" class="contacts_input" id="email" placeholder="Email">
            <button id="changeContacts">Change contacts</button>
        </div>
        <div class="contacts_rightPart"></div>
        </div>
        `
    )
    $('#changeContacts').click(()=>{
        const data = {
            address: $('#address').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
        }
        axios.post('/contacts', data)
        .then((res)=>{
            console.log(res.data)
            $('#address').val('')
            $('#phone').val('')
            $('#email').val('')
        })
    })
})
$('#newslatter').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '600')
    $('#orders').css('font-weight', '400')
    $('.content').append(
        `
        <div>newslatter here</div>
        `
    )
})
$('#orders').click(()=>{
    $('.content').empty();
    $('#plants').css('font-weight', '400')
    $('#contacts').css('font-weight', '400')
    $('#newslatter').css('font-weight', '400')
    $('#orders').css('font-weight', '600')
    $('.content').append(
        `
        <div>orders here</div>
        `
    )
})

//existing plants displaying
function getPlants(){
    axios.get('http://localhost:3000/plants')
    .then((res)=>{
        console.log(res.data)
        for(let el of res.data){
            $('.plantslist').append(
                `
                <div class="plant">
                <img class="plantImg" src="./imgs/${el.image}" alt="">
                <h3 class="plantName">${el.title}</h3>
                <div class="plantRating">${el.rating}</div>
                <div class="plantPrice">$${el.price}.00</div>
                <div class="plant_actions">
        <div class="plant_edit">
            <img class="plant_edit_pen" src="./imgs/pen.png" alt="" id="edit${el._id}">
        </div>
        <div class="plant_delete">
            <img class="plant_delete_top" src="./imgs/bin top.png" alt="">
            <img class="plant_delete_bottom" id="${el._id}" src="./imgs/bin bottom.png" alt="">
        </div>
    </div>
            </div>
                `
            )
        }
    
        //actions animations
        $('.plant_delete').hover(
            function () {
                $(this).find('.plant_delete_top').css('top', '-6px');
                $(this).find('.plant_delete_top').css('transform', 'rotate(-15deg)');
            },
            function () {
                $(this).find('.plant_delete_top').css('top', '0px');
                $(this).find('.plant_delete_top').css('transform', 'rotate(0deg)');
            }
        ); 
        $('.plant_edit').hover(
            function () {
                $(this).find('.plant_edit_pen').css('transform', 'rotate(-17deg)');
            },
            function () {
                $(this).find('.plant_edit_pen').css('transform', 'rotate(0deg)');
            }
        ); 
    
        //edtiting the platns
        $('.plant_edit_pen').click((e)=>{
            $('.editPlantPopup_container').css('display', 'flex')
            $('#editPlantPopupXmark').click(()=>{
                $('.editPlantPopup_container').css('display', 'none')
            })
            let ID = e.target.id;
            if (ID.substring(0, 4) == 'edit') {
                ID = ID.substring(4);
                console.log(ID);
        
                $('.editPlant_btn').click(()=>{
                    let data = {
                        image: $('#newPlant_image').val(),
                        title: $('#newPlant_name').val(),
                        rating: $('#newPlant_rating').val(),
                        price: $('#newPlant_price').val(),
                    };
                    axios.put(`http://localhost:3000/edit-plant/${ID}`, data)
                        .then(res => {
                            $('.editTaskPopup_container').css('display', 'none')
                            location.reload();
                        })
                })
            }
        })
    
        //deleting plants from the catalog
        $('.plant_delete_bottom').click((e)=>{
        console.log(e.target)
        let id = e.target.id;
        console.log(id)
        axios.delete(`http://localhost:3000/plant/${id}`)
        .then(res => {
            location.reload()
        })
        })
    
    })
    
};
getPlants();

//theme changing
let theme = localStorage.getItem('theme') || 'light';
$('.theme').click(function(){
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
        $('.theme').css('justify-content', 'flex-start')
        $('.theme').css('background-color', '#566270')
        $('.theme_circle').css('background-color', '#fff')
        $('.theme_circle').css('border', '2px #566270 solid')

    }else{
        $('.theme').css('justify-content', 'flex-end')
        $('.theme').css('background-color', '#fff')
        $('.theme_circle').css('background-color', '#566270')
        $('.theme_circle').css('border', '2px #fff solid')


    }
}
changeTheme(theme);

//adding new plants
$('.addNewPlantsBtn').click(()=>{
    $('.addNewPlantPopup_container').css('display', 'flex')
})
$('#addNewPlantXmark').click(()=>{
    $('.addNewPlantPopup_container').css('display', 'none')
})
$('.addNewPlant_btn').click(()=>{
    $('.addNewPlantPopup_container').css('display', 'none')

    let data = {
        title: $('#plant_name').val(),
        price: $('#plant_price').val(),
        image: $('#plant_image').val(),
        rating: $('#plant_rating').val()
    }
    axios.post('http://localhost:3000/add-plants', data)
    location.reload();
})

