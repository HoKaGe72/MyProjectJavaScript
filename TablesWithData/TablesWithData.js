document.addEventListener('DOMContentLoaded', ()=>{
    sortTable();
    document.getElementById('idRecord').addEventListener('input', checkInputs);
    document.getElementById('firstNameRecord').addEventListener('input', checkInputs);
    document.getElementById('lastNameRecord').addEventListener('input', checkInputs);
    document.getElementById('emailRecord').addEventListener('input', checkInputs);
    document.getElementById('phoneRecord').addEventListener('input', checkInputs)
    checkInputs();
})

// Начальный индекс для большого набора данных, массив данных, страница
let PaginIndex, Data, Page, isAscending = true;

//Функция сортировки столбцов
function sortTable(columnIndex) {
    const table = document.getElementById("tbody");
    let rows = Array.from(table.rows).slice(0);
    // let isAscending = table.getAttribute("data-sort-asc") === "true" ? true : ;

    // Сброс стрелок
    const headers = document.querySelectorAll("th");
    headers.forEach((header, index) => {
        const icon = header.querySelector(".sort-icon");
        if (index === columnIndex) {
            icon.textContent = isAscending ? "▼" : "▲"; // Меняем стрелку для текущего столбца
        } else {
            icon.textContent = "▼"; // Сбрасываем стрелки для остальных столбцов
        }
    });

    // Сортировка
    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].innerText;
        const cellB = rowB.cells[columnIndex].innerText;

        // Проверяем, является ли текущий столбец числовым (например, id)
        if (columnIndex === 0) {
            return isAscending ? parseInt(cellA) - parseInt(cellB) : parseInt(cellB) - parseInt(cellA);
        } else {
            return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        }
    });

    isAscending = !isAscending;
    table.setAttribute("data-sort-asc", isAscending);

    rows.forEach(row => {
        table.appendChild(row);
    });
}

//Ссылка на маленький набор данных
const SmallData = 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D'

//Ссылка на большой набор данных
const BigData = 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D'

//Обрашение к серверу и получение данных
class RequestServer{
    async requestData(url){
        try{
            const respons = await fetch(url);
            if(!respons.ok){
                console.log('Network response was not ok');
            }else{
                console.log('Network response was ok');
            }
            return respons.json();
        }catch(error){
            console.error('Ошибка в fetch', error);
        }
    }
}

// Класс для вывода данных на таблицу
class FillTableData {
    constructor(data) {
        this.data = data;
    }

    //Метод для заполнения таблицы с данными из маленького набора данных
    OutputSmallData(){
        this.ClearTable();
        for(let i=0;i<this.data.length;i++){
            setTimeout(()=>{
                document.getElementById('tbody').appendChild(this.render(this.data[i]));
            },i*100)
        }
    }

    //Метод для заполнения таблицы с данными из большого набора данных
    OutputBigData(StartIndex){
        this.ClearTable();
        let second=0
        for(let i = StartIndex; i<StartIndex+50;i++){
            second++;
            setTimeout(()=>{
                document.getElementById('tbody').appendChild(this.render(this.data[i]))
            },second*100)
        }
    }

    //Заполнение строки
    render(row) {
        const trow = document.createElement('tr');
        trow.setAttribute('id', `${row["id"]}`);
        trow.innerHTML=`<td ondblclick="UserCard(${row["id"]})">${row["id"]}</td>
                        <td>${row["firstName"]}</td>
                        <td>${row["lastName"]}</td>
                        <td>${row["email"]}</td>
                        <td>${row["phone"]}</td>`;
        return trow
    }

    //Удаление всех записей, если если предыдущие методы вызываются повторна
    ClearTable(){
        const TBody = document.getElementById('tbody').querySelectorAll('tr');
        TBody.forEach(row =>{
            row.remove();
        });
    }
}

// Получение маленького набора данных и вывод на таблицу
function ButtonSmallData(){
    ShowControllerTable();
    const ReceivedData = new RequestServer();
    ReceivedData.requestData(SmallData).then(response => {
        Data = response;
        new FillTableData(response).OutputSmallData();
        document.querySelector('.table-arrows').style.display='none';
    });
}

// Получение большого набора данных и вывод на таблицу
function ButtonBigData(){
    ShowControllerTable();
    PaginIndex = 0;
    Page = 1;
    const ReceivedData = new RequestServer();
    ReceivedData.requestData(BigData).then(response => {
        Data = response;
        new FillTableData(response).OutputBigData(PaginIndex);
        document.getElementById('number-table').innerText = `${Page}/${Data.length/50}`;
        setTimeout(()=>{document.querySelector('.table-arrows').style.display='flex';}, 5100);
        prohibition();
    });
}

// Показать элементы управления и таблицу
function ShowControllerTable(){
    setTimeout(()=>{document.querySelector('.controller').style.display = 'grid';},200)
    setTimeout(()=>{document.querySelector('form').style.display = 'flex';},300);
}

// Пагинация для большого набора данных
function PrevNext(Direction){
    const ReceivedData = new FillTableData(Data);

    if(Direction==='next'){
        PaginIndex+=50;
        Page++;
    }else{
        PaginIndex-=50;
        Page--;
    }
    ReceivedData.OutputBigData(PaginIndex);
    document.getElementById('number-table').innerText = CalculatePageNumber();
    prohibition();
}

// Рассчет страниц
function CalculatePageNumber(){
    let Difference = Data.length%50;
    let MaxPage = Data.length%50===0 ? Data.length/50 : ((Data.length - Difference)/50)+1 ;
    return `${Page}/${MaxPage}`;
}

// Поиск в таблице
function searchTable() {
    const input = document.getElementById("filter");
    const filter = input.value.toLowerCase();
    const table = document.getElementById("data-table");
    const rows = Array.from(table.rows).slice(1);
    const selectedColumnIndex = document.getElementById("search-column").value;

    rows.forEach(row => {
        const cells = row.cells;
        const cellValue = cells[selectedColumnIndex].innerText.toLowerCase();
        const shouldDisplay = cellValue.includes(filter);
        row.style.display = shouldDisplay ? "" : "none";
    });
}

// Блокировка кнопок пагинации при достижении максимального/минимального значения страниц
prohibition = ()=> {
    document.querySelector('#prev').classList.toggle('disabled', Page === 1);
    document.querySelector('#next').classList.toggle('disabled', Page === Data.length);
}

// Показать блок добавления записи
function ShowAddRecordBlock(){
    CancelCard();
    document.getElementById('Record').style.display='flex';
    document.querySelector('main').style.opacity='0.2';
    document.querySelector('main').style.pointerEvents='none';
}

// Добавить запись в таблицу
function AddRecord(){
    let record = {
        'id': Number,
        'firstName': '',
        'lastName': '',
        'email': '',
        'phone': '',
        'address': {
            'streetAddress': "none",
            'city': "none",
            'state': "none",
            'zip': "none"
        },
        'description': "none"
    }

    if(validation()){
        record['id'] = document.getElementById('idRecord').value;
        record['firstName'] = document.getElementById('firstNameRecord').value;
        record['lastName'] = document.getElementById('lastNameRecord').value;
        record['email'] = document.getElementById('emailRecord').value;
        record['phone'] = document.getElementById('phoneRecord').value;
        Data.unshift(record);
        const UpdateTable = new FillTableData(Data);
        if(Data.length<=50){
            UpdateTable.OutputSmallData();
        }else{
            PaginIndex = 0;
            Page = 1;
            UpdateTable.OutputBigData(PaginIndex)
            document.getElementById('number-table').innerText = CalculatePageNumber();
            prohibition();
        }
        CancelRecord();
    }
}

// Отменить добавление записи
function CancelRecord(){
    document.getElementById('Record').style.display='none';
    document.querySelector('main').style.opacity='1';
    document.querySelector('main').style.pointerEvents='auto';
    ClearRecord();
}

// Очистить полья в блоке добавления записи
function ClearRecord(){
    document.getElementById('idRecord').value = '';
    document.getElementById('firstNameRecord').value = '';
    document.getElementById('lastNameRecord').value = '';
    document.getElementById('emailRecord').value = '';
    document.getElementById('phoneRecord').value = '';
    document.querySelector('.errorRecord').value = '';
}

// Блокировка кнопки "Добавить записиь", если все поля не заполнены
function checkInputs() {
    const idInput = document.getElementById('idRecord');
    const firstNameInput = document.getElementById('firstNameRecord');
    const lastNameInput = document.getElementById('lastNameRecord');
    const emailInput = document.getElementById('emailRecord');
    const phoneInput = document.getElementById('phoneRecord');
    const addRecordButton = document.querySelector('.AddRecord');

    const allFilled = idInput.value.trim() !== '' &&
        firstNameInput.value.trim() !== '' &&
        lastNameInput.value.trim() !== '' &&
        emailInput.value.trim() !== '' &&
        phoneInput.value.trim() !== '';

    if (allFilled) {
        addRecordButton.style.opacity = '1';
        addRecordButton.style.pointerEvents = 'auto';
    } else {
        addRecordButton.style.opacity = '0.2';
        addRecordButton.style.pointerEvents = 'none';
    }
}

// Проверка на формат введенных данных для электронной почты и номера телефона
function validation() {
    const emailInput = document.getElementById('emailRecord');
    const errorRecord = document.querySelector('.errorRecord');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Валидация почты

    if (!emailPattern.test(emailInput.value)) {
        errorRecord.textContent = 'Пожалуйста, введите корректный email.';
        return false;
    } else {
        errorRecord.textContent = '';
    }

    const phoneInput = document.getElementById('phoneRecord');
    const phonePattern = /^\(\d{3}\)\d{3}-\d{4}$/; // Валидация номера телефона

    if (!phonePattern.test(phoneInput.value)) {
        errorRecord.textContent = 'Пожалуйста, введите корректный номер телефона.';
        return false;
    } else {
        errorRecord.textContent = '';
    }

    if (emailPattern.test(emailInput.value) && phonePattern.test(phoneInput.value)) {
        alert('Форма успешно отправлена!');
        return true
    }
}

// Вывод информации для выделенного id
function UserCard(userId){
    const InfoUser = document.querySelector('.InfoUser')
    const info = document.querySelector('.info')
    for (let i = 0; i < Data.length; i++){
        if(Data[i].id === userId){
            info.innerHTML = `<p><strong>ID:</strong> ${Data[i].id}</p>
                                <p><strong>Имя:</strong> ${Data[i].firstName}</p>
                                <p><strong>Фамилия:</strong> ${Data[i].lastName}</p>
                                <p><strong>Email:</strong> ${Data[i].email}</p>
                                <p><strong>Телефон:</strong> ${Data[i].phone}</p>
                                <p><strong>Адрес:</strong> ${Data[i].address.streetAddress}, ${Data[i].address.city}, ${Data[i].address.state}, ${Data[i].address.zip}</p>
                                <p><strong>Описание:</strong> ${Data[i].description}</p>`;
            break;
        }
    }
    InfoUser.style.display = 'block';
}

// Закрытие блока с информацией
function CancelCard() {
    document.querySelector('.InfoUser').style.display = 'none';
}