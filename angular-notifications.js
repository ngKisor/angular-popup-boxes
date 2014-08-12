(function()
{
	var module = angular.module("angular-notifications", ["ui.bootstrap"]);

	var singleton = new TinyEmitter();
	singleton.alerts = [];

	module.factory("angular-notifications", ["$modal", "$q", function($modal, $q)
	{
		var translate = function(str) { return str; };

		function confirm(content, options)
		{
			options = options || {};

			var modalId = 'modal-' + Math.floor(Math.random() * 9999);
			var modalEl;

			var html  = '<div class="modal-body" id="' + modalId +  '">';
				html += content;
				html += '</div>';
				html += '<div class="modal-footer">';
				html += '<button class="btn btn-sm btn-danger angular-notification-btn-cancel">' + translate("general.cancel") + '</button>';
				html += '<button class="btn btn-sm btn-primary angular-notification-btn-ok">' + translate("general.ok") + '</button>';
				html += '</div>';

			var modal = $modal.open(
			{
				template: html
			});

			setTimeout(function()
			{
				modalEl = $("#" + modalId).parent().parent();
				modalEl.width(options.width || 370);
				modalEl.find(".angular-notification-btn-ok").click(function()
				{
					modal.close();
				});
				modalEl.find(".angular-notification-btn-cancel").click(function()
				{
					modal.dismiss();
				});
			}, 1);

			return modal;
		}

		function alert(content, options)
		{
			options = options || {};

			var modalId = 'modal-' + Math.floor(Math.random() * 9999);
			var modalEl;

			var html  = '<div class="modal-body" id="' + modalId +  '">';
				html += content;
				html += '</div>';
				html += '<div class="modal-footer">';
				html += '<button class="btn btn-sm btn-primary angular-notification-btn-ok">' + translate("general.ok") + '</button>';
				html += '</div>';

			var modal = $modal.open(
			{
				template: html
			});

			setTimeout(function()
			{
				modalEl = $("#" + modalId).parent().parent();
				modalEl.width(options.width || 370);
				modalEl.find(".angular-notification-btn-ok").click(function()
				{
					modal.close();
				});
			}, 1);

			return modal;
		}

		function input(content, options)
		{
			options = options || {};
			
			var modalId = 'modal-' + Math.floor(Math.random() * 9999);
			var modalEl;

			var html  = '<div class="modal-body" id="' + modalId +  '">';
				html += content;
				html += '<br/><br/><div class="form"><input class="form-control angular-notification-input" /></div>';
				html += '</div>';
				html += '<div class="modal-footer">';
				html += '<button class="btn btn-sm btn-danger angular-notification-btn-cancel">' + translate("general.cancel") + '</button>';
				html += '<button class="btn btn-sm btn-primary angular-notification-btn-ok">' + translate("general.ok") + '</button>';
				html += '</div>';

			var deferred = $q.defer();

			var modal = $modal.open(
			{
				template: html
			});

			setTimeout(function()
			{
				modalEl = $("#" + modalId).parent().parent();
				modalEl.width(options.width || 370);
				modalEl.find(".angular-notification-btn-ok").click(function()
				{
					modal.close();
				});
				modalEl.find(".angular-notification-btn-cancel").click(function()
				{
					modal.dismiss();
				});
			}, 1);

			modal.result.then(function()
			{
				var input = modalEl.find(".angular-notification-input").val();
				if(input === "")
				{
					deferred.reject();
				}
				else
				{
					deferred.resolve(input);
				}
			}, deferred.reject);

			modal.result = deferred.promise;

			return modal;
		}

		var flash = function(type, message)
		{
			singleton.emit("change");
			singleton.alerts.push({type: type, msg: message});
		};

		flash.clear = function()
		{
			singleton.emit("change");
			singleton.alerts = [];
		};

		function toast(type, message)
		{
			$.bootstrapGrowl(message, { type: type });
		}

		return {
			confirm: confirm,
			alert: alert,
			input: input,
			flash: flash,
			toast: toast
		};
	}]);

	module.directive("angularFlash", function()
	{
		return {
			link: function(scope, element)
			{
				singleton.on("change", function()
				{
					setTimeout(function()
					{
						scope.$digest();
					}, 100);
				});

				scope.singleton = singleton;

				scope.closeAlert = function(index)
				{
					singleton.emit("change");
					singleton.alerts.splice(index, 1);
				};
			},
			template: '<alert ng-animate="{enter: \'enter-slide\', leave: \'leave-slide\'}" ng-repeat="alert in singleton.alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</alert>'
		};
	});
})();