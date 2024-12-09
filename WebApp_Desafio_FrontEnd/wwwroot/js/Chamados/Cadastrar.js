$(document).ready(function () {

    $('.glyphicon-calendar').closest("div.date").datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: false,
        format: 'dd/mm/yyyy',
        autoclose: true,
        language: 'pt-BR'
    });

    $.validator.addMethod("dataFutura", function (value) {
        // A função Date.parse converte a string em data
        var dataInput = DateFromString(value);  // A data fornecida pelo usuário
        var dataAtual = new Date().setHours(0, 0, 0, 0);        // A data atual
        return dataInput >= dataAtual;  // Verifica se a data é maior ou igual à data atual
    }, "A data não pode ser menor que a data atual.");

    $('#form').validate({
        rules: {
            Assunto: {
                required: true,
                maxlength: 100
            },
            Solicitante: {
                required: true,
                maxlength: 100
            },
            IdDepartamento: {
                required: true
            },
            DataAbertura: {
                required: true,
                dataFutura: true
            }
        },
        messages: {
            Assunto: {
                required: "O assunto é obrigatório.",
                maxlength: "O assunto não pode ter mais de 100 caracteres."
            },
            Solicitante: {
                required: "O solicitante é obrigatório.",
                maxlength: "O solicitante não pode ter mais de 100 caracteres."
            },
            IdDepartamento: {
                required: "O departamento é obrigatório."                
            },
            DataAbertura: {
                required: "A data de abertura é obrigatória."  

            }
        }
    });

    $('#btnCancelar').click(function () {
        Swal.fire({
            html: "Deseja cancelar essa operação? O registro não será salvo.",
            type: "warning",
            showCancelButton: true,
        }).then(function (result) {
            if (result.value) {
                history.back();
            } else {
                console.log("Cancelou a inclusão.");
            }
        });
    });

    $('#btnSalvar').click(function () {

        if ($('#form').valid() != true) {
            FormularioInvalidoAlert();
            return;
        }

        let chamado = SerielizeForm($('#form'));
        let url = $('#form').attr('action');
        //debugger;

        $.ajax({
            type: "POST",
            url: url,
            data: chamado,
            success: function (result) {

                Swal.fire({
                    type: result.Type,
                    title: result.Title,
                    text: result.Message,
                }).then(function () {
                    window.location.href = config.contextPath + result.Controller + '/' + result.Action;
                });

            },
            error: function (result) {

                Swal.fire({
                    text: result,
                    confirmButtonText: 'OK',
                    icon: 'error'
                });

            },
        });
    });

});
