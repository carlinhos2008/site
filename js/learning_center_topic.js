$('#dropdownAlgorithm').change(function () {

    if ($(this).val() === "1") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="7">0.21.0</option>');
        $('#dropdownVersion').append('<option value="5">0.17</option>');
        $('#dropdownVersion').append('<option value="1">0.8</option>');

        Cookies.set('algorithm', $(this).val());
        Cookies.set('version', "7");
    }
    if ($(this).val() === "2") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="6">0.18</option>');
        $('#dropdownVersion').append('<option value="4">0.16</option>');
        $('#dropdownVersion').append('<option value="1">0.8</option>');

        Cookies.set('algorithm', $(this).val());
        Cookies.set('version', "6");
    }
    if ($(this).val() === "3") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="11">2.13</option>');
        $('#dropdownVersion').append('<option value="10">1.2.5.2</option>');
        $('#dropdownVersion').append('<option value="1">0.8</option>');

        Cookies.set('algorithm', $(this).val());
        Cookies.set('version', "11");
    }
    if ($(this).val() === "4") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="5">0.17</option>');
        $('#dropdownVersion').append('<option value="3">0.14</option>');
        $('#dropdownVersion').append('<option value="2">0.12</option>');

        Cookies.set('algorithm', $(this).val());
        Cookies.set('version', "5");
    }
    if ($(this).val() === "5") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="9">3.3</option>');
        $('#dropdownVersion').append('<option value="8">3.1</option>');

        Cookies.set('algorithm', $(this).val());
        Cookies.set('version', "9");
    }
});

$('#dropdownVersion').change(function () {
    Cookies.set('version', $(this).val());
});

if (Cookies.get('algorithm') != null) {
    $('#dropdownAlgorithm').val(Cookies.get('algorithm'));

    if (Cookies.get('algorithm') === "1") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="7">0.21.0</option>');
        $('#dropdownVersion').append('<option value="5">0.17</option>');
        $('#dropdownVersion').append('<option value="1">0.8</option>');
    }
    if (Cookies.get('algorithm') === "2") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="6">0.18</option>');
        $('#dropdownVersion').append('<option value="4">0.16</option>');
        $('#dropdownVersion').append('<option value="1">0.8</option>');
    }
    if (Cookies.get('algorithm') === "3") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="11">2.13</option>');
        $('#dropdownVersion').append('<option value="10">1.2.5.2</option>');
        $('#dropdownVersion').append('<option value="1">0.8</option>');
    }
    if (Cookies.get('algorithm') === "4") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="5">0.17</option>');
        $('#dropdownVersion').append('<option value="3">0.14</option>');
        $('#dropdownVersion').append('<option value="2">0.12</option>');
    }
    if (Cookies.get('algorithm') === "5") {
        $('#dropdownVersion').empty();
        $('#dropdownVersion').append('<option value="9">3.3</option>');
        $('#dropdownVersion').append('<option value="8">3.1</option>');
    }

    if (Cookies.get('version') != null) {
        $('#dropdownVersion').val(Cookies.get('version'));
    }
}

$("#buttonGo").click(function () {
    if (Cookies.get('algorithm') == null) {
        Cookies.set('algorithm', "1");
    }
    if (Cookies.get('version') == null) {
        Cookies.set('version', "7");
    }
    location.reload();
});