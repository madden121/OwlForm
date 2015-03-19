(function($){
	var forbiden_inputs = ["password","file","button","reset","submit"];
	jQuery.fn.OwlInputScan = function(){
		var allowed_string = '';
		$(forbiden_inputs).each(function(key,value){
			allowed_string = allowed_string + '[type='+value+'],';
		});
		allowed_string = allowed_string.slice(0,allowed_string.length - 1);
		var allowed = $(this).find('input,select,textarea').not(allowed_string);
		return allowed;
	}
	
	jQuery.fn.OwlForm = function(options){
	
		options = $.extend({
			defColor:"white",
			hoverColor:"red"
		}, options);
		
		
		var formJson;
		function getFormData(formArray){
			
			arr = {},data = formArray.serializeArray();
			$(data).each(function(index) {
				arr[$(this)[0]['name']] = $(this)[0]['value'];
			});
			return JSON.stringify(arr);
		}
		
		function sendData(data,method,action){
			data = $.parseJSON(data);
			var dataEncoded = $.param( data, true );
		
			$.ajax({
				url: action,
				type: method,
				data: dataEncoded
			});
		}	
		
		var Owl = function(){   
			var forms = $(this);
			
			$(this).each(function(index){
				
				formJson = getFormData($(this).OwlInputScan());
				$(this).append('<input type="hidden" data-owlInitial=\''+formJson+'\' data-owlInput>').append('<input type="hidden" data-owlFinal data-owlInput>');
			});
			
			$(this).bind("change",function(){
				formJson = getFormData($(this).OwlInputScan());
				if($(this).children('[data-owlInitial]').attr('data-owlInitial') != $(this).children('[data-owlFinal]').attr('data-owlFinal') && $(this).children('[data-owlFinal]').attr('data-owlFinal') != formJson && $(this).children('[data-owlInitial]').attr('data-owlInitial') != formJson){
					$(this).attr('data-owlChanged','true');
					$(this).children('[data-owlFinal]').attr('data-owlFinal',formJson);
				}
			});	
			
			$(window).on("beforeunload",function(){
				$(forms).each(function(index){
					if($(this).attr('data-owlChanged') == 'true' && $(this).attr('data-owlSubmited') != 'true'){
						var data = $(this).children('[data-owlFinal]').attr('data-owlFinal');
						var method = $(this).attr('method');
						var action = $(this).attr('action');
						if(action.indexOf(location.host) + 1){	
							var hostlength = window.location.protocol.length + location.host.length + 2;
							action = action.slice(hostlength,action.length);
						}
						sendData(data,method,action);
					}
				});
			});
			
			$(this).submit(function(){
				$(this).attr('data-owlSubmited','true');
			});
			
		};
	    return this.each(Owl); 
	};
})(jQuery);
