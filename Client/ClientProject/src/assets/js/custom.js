$(function() {
    $(document).ready(function() {
        var room_name = ["Salon de thé kouya",
                 "Salon des matrixé",
                 "Salon des Uchiwas",
                 "Salon des mangeurs de bonne bouffe"];

        var modal1 = document.getElementById('id01');
        var modal2 = document.getElementById('id02');
        var connectedrrom = 100;

        if (localStorage.getItem("token") === null) {
            Swal.fire({
                title: 'You are not logged!',
                timer: 2000,
                icon: 'error',
                onBeforeOpen: () => {
                  Swal.showLoading()
                  timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                      const b = content.querySelector('b')
                      if (b) {
                        b.textContent = Swal.getTimerLeft()
                      }
                    }
                  }, 100)
                },
              });
            
              //alert("not logged ");
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
                    Swal.fire({
                        title: "Connection ",
                        //title: result.token,
                        timer: 3000,
                        icon: 'success',
                        onBeforeOpen: () => {
                          Swal.showLoading()
                          timerInterval = setInterval(() => {
                            const content = Swal.getContent()
                            if (content) {
                              const b = content.querySelector('b')
                              if (b) {
                                b.textContent = Swal.getTimerLeft()
                              }
                            }
                          }, 100)
                        },
                      });
                    //alert(result.token);
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
                    Swal.fire({
                        title: JSON.stringify(result),
                        timer: 3000,
                        icon: 'success',
                        onBeforeOpen: () => {
                          Swal.showLoading()
                          timerInterval = setInterval(() => {
                            const content = Swal.getContent()
                            if (content) {
                              const b = content.querySelector('b')
                              if (b) {
                                b.textContent = Swal.getTimerLeft()
                              }
                            }
                          }, 100)
                        },
                      });
                    //alert(JSON.stringify(result)); // result is an object which is created from the returned JSON
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
            $.ajax({
                url: "http://localhost:13008/channels",
                type: "GET",
                processData: false,  // indique à jQuery de ne pas traiter les données
                contentType: false,   // indique à jQuery de ne pas configurer le contentType
                cache:false,
                dataType: "json", // Change this according to your response from the server.
                success : function(result) {
        
                    var array = JSON.parse(result);
                    for (var i = 0; i < array.length; i++) {
                        $('.channels-list-text').append('<li id='+ i +' class="channel focusable channel-text ">'+ //active
                            '<span class="channel-name">'+ array[i] +'</span>'+
                            '<button class="button" role="button" aria-label="Invite"><svg><use xlink:href="#icon-invite" /></svg></button>'+
                            '<button class="button" role="button" aria-label="settings"><svg><use xlink:href="#icon-channel-settings" /></svg></button>'+
                        '</li>');
                        console.log(array[i]);
                      }
        
                      /*Swal.fire({
                        title: result,
                        timer: 3000,
                        icon: 'question',
                        onBeforeOpen: () => {
                          Swal.showLoading()
                          timerInterval = setInterval(() => {
                            const content = Swal.getContent()
                            if (content) {
                              const b = content.querySelector('b')
                              if (b) {
                                b.textContent = Swal.getTimerLeft()
                              }
                            }
                          }, 100)
                        },
                      }); salon de thé...*/

                    //alert(result); // result is an object which is created from the returned JSON
                    
                },
                error: function (e) {
                    //alert('Error ' + JSON.stringify(e));
                }});

            document.getElementById('dcacc').style.display='block';

            /*Swal.fire({
                title: 'Error!',
                text: 'Do you want to continue',
                icon: 'error',
                confirmButtonText: 'Cool'
              });*/
             
              Swal.fire({
                title: 'You are connected!',
                timer: 3000,
                icon: 'success',
                onBeforeOpen: () => {
                  Swal.showLoading()
                  timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                      const b = content.querySelector('b')
                      if (b) {
                        b.textContent = Swal.getTimerLeft()
                      }
                    }
                  }, 100)
                },
              });
              
             // alert("logged gg");

//            alert.success("logged gg");
            $('.username').text(localStorage.getItem("name"));
            var mic = 0;
            var casque = 0;
            var reglage = 0;

            var socket = io('ws://localhost:3000', {transports: ['websocket']});
            socket.on('connect', function () {
                console.log('connected socket !');
              //dans subject on vettra la room choisit via le front via ta partie bryan on changera "room"
              });

            $('ul').on('click', '.channel', function(e) {
                if (connectedrrom != 100)
                $('#'+ connectedrrom).removeClass('active');
                $('#'+ $(this).attr("id")).addClass('active');

                socket.emit('first_log', {subject: $(this).attr("id"), name : localStorage.getItem("name"), oldroom : connectedrrom});

                //if ($(this).attr("id") != connectedrrom) { 
                connectedrrom = $(this).attr("id");
                  e.preventDefault();
                
                //  alert("gg" + $(this).attr("id")); alert gg0 ...
                //}
                //else {
                    //alert("deconnecting");
                    //socket.disconnect();
                //}
            });

            //reception des me
            socket.on('message', function (data) {
              if (data.filedata) {
                $('#messages').append(data.name + ' : ' + data.msg +  '<img src="'+ data.filedata +'" height=480 width=480> </img>' + '<br />');
              }
              else
                if (data.name) {
                    $('#messages').append(data.name + ' : ' + data.msg +'<br />');
                    console.log(data.filedata);
                  }
                else if (data.connected)
                $('#messages').append('<p style="color:green;">' + data.msg +'</p>' + '<br />');
                else
                $('#messages').append('<p style="color:red;">' + data.msg +'</p>' + '<br />') ;
           });

           /*socket.on(room_name[2], function (data) {
            console.log(data.msg);
            //socket.emit(room_name[room], { name: name, msg: 'Bonjour'});
        });*/

            $('#buttonsend').click(function(e) {
                e.preventDefault();
                //alert("test13");
                /*var fd = new FormData();
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
                });*/
                //socket.emit(room_name[2], {subject: 2, message: 'Hello everyone welcome  :', name : localStorage.getItem("name")});
                
                //alert("J'envoi " + $('#story').text()); message d'envoi
                var file = $('#fileinput').prop('files')[0];
                var datafile;
                var filefound = 0;

                if (file) {
                  var reader = new FileReader();
                  reader.onload = function() {
                    var binaryString = this.result;
                    datafile = binaryString;
                    filefound = 1;
                    socket.emit('message', {subject: 2, name : localStorage.getItem("name"), msg: $('#story').val(), filedata: this.result });
                  }
                  reader.readAsDataURL(file);
                  if (filefound == 0)
                    socket.emit('message', {subject: 2, name : localStorage.getItem("name"), msg: $('#story').val() });
                }
                 else 
                socket.emit('message', {subject: 2, name : localStorage.getItem("name"), msg: $('#story').val() });
            });

            $('#sendmsg').click(function() {
                //window.localStorage.getItem(key);
            });
        }
        $('#dcacc').click(function() {
            localStorage.clear();
        });
        function hexToBase64(str) {
          return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
      }
    });
});
