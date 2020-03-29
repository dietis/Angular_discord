

$(function() {
    $(document).ready(function() {
        var modal1 = document.getElementById('id01');
        var modal2 = document.getElementById('id02');

        if (localStorage.getItem("token") === null) {
            alert("not logged ");
            document.getElementById('id01').style.display='block';

            $('#logdisc').click(function(e) {
                e.preventDefault();
                var fd = new FormData();
                fd.append("name", $('#nameinput').val());
                fd.append("password", $('#pswinput').val());
                $.ajax({
                url: "http://localhost:13008/getToken",
                type: "POST",
                data: fd,
                processData: false,  // indique à jQuery de ne pas traiter les données
                contentType: false,   // indique à jQuery de ne pas configurer le contentType
                cache:false,
                dataType: "json", // Change this according to your response from the server.
                success : function(result) {
                    //alert(JSON.stringify(result)); // result is an object which is created from the returned JSON
                    console.log("gg");
                    alert(result.token);
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("name", $('#nameinput').val());
                    document.getElementById('id01').style.display='none';
                    document.getElementById('dcacc').style.display='block';
                },
                error: function (e) {
                    //alert('Error ' + JSON.stringify(e));
                }});
            //localStorage.setItem("logged", "on");
            });
            $('#regibut').click(function(e) {
                e.preventDefault();
                var fd = new FormData();
                fd.append("name", $('#nameinput').val());
                fd.append("password", $('#pswinput').val());
                $.ajax({
                url: "http://127.0.0.1:13008/register",
                type: "POST",
                data: fd,
                processData: false,  // indique à jQuery de ne pas traiter les données
                contentType: false,   // indique à jQuery de ne pas configurer le contentType
                cache:false,
                dataType: "json", // Change this according to your response from the server.
                success : function(result) {
                    alert(JSON.stringify(result)); // result is an object which is created from the returned JSON
                    console.log("gg");
                },
                error: function (e) {
                    alert('Error ' + JSON.stringify(e));
                    console.log("Error");
                }
                });
                //localStorage.setItem("logged", "on");
             });

            //localStorage.setItem("logged", "on");
          }
        else {
            document.getElementById('dcacc').style.display='block';
            alert("logged gg");
            $('.username').text(localStorage.getItem("name"));
            var mic = 0;
            var casque = 0;
            var reglage = 0;

            var socket = io('ws://localhost:3000', {transports: ['websocket']});

            socket.on('connect', function () {
              console.log('connected socket !');
                                    //dans subject on vettra la room choisit via le front
              socket.emit('first_log', {subject: 'room', message: 'Hello everyone welcome  :', name : localStorage.getItem("name")});
            });
            
            socket.on('respond', function (data) {
              console.log(data);
            });
                          
            $('#buttonsend').click(function(e) {
                e.preventDefault();
                alert("test");
                var fd = new FormData();

                fd.append("content", $('#story').val());
                var file = $('#fileinput').prop('files')[0];
                if (file)
                  formData.append('photo', file, file.name);
  
                $.ajax({
                url: "http://127.0.0.1:13008/register",
                type: "POST",
                data: fd,
                processData: false,  // indique à jQuery de ne pas traiter les données
                contentType: false,   // indique à jQuery de ne pas configurer le contentType
                cache:false,
                dataType: "json", // Change this according to your response from the server.
                success : function(result) {
                    alert(JSON.stringify(result)); // result is an object which is created from the returned JSON
                    console.log("gg");
                },
                error: function (e) {
                    alert('Error ' + JSON.stringify(e));
                    console.log("Error");
                }
                });
            });
        }

        $('#sendmsg').click(function() {
            //window.localStorage.getItem(key);
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("token", "MYTOKEN");
                alert(localStorage.getItem("token"));
            } else {
                    alert("Sorry, your browser does not support Web Storage...");
            }
            alert("gg");
        });
        $('#dcacc').click(function() {
            localStorage.clear();
        });
    });
});
