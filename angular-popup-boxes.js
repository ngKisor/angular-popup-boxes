angular.module("angularPopupBoxes", ["ui.bootstrap"])
.provider("angularPopupBoxes", function()
{
	var that = this;

	this.okText = 'Ok';
	this.cancelText = 'Cancel';

	var setTexts = this.setTexts = function (okText, cancelText)
	{
		that.okText = okText;
		that.cancelText = cancelText;
	}

	this.$get = ["$modal", "$q", function($modal, $q)
	{
		function buildModal(content, ok, cancel, options)
		{
			var modalId = 'modal-' + Math.floor(Math.random() * 9999);
			var modalEl;

			var html  = '<div class="modal-body" id="' + modalId +  '">';
					html += content;
					html += '</div>';
					html += '<div class="modal-footer">';
					if(cancel) html += '<button class="btn btn-sm btn-danger angular-notification-btn-cancel">' + that.cancelText + '</button>';
					if(ok) html += '<button class="btn btn-sm btn-primary angular-notification-btn-ok">' + that.okText + '</button>';
					html += '</div>';

			var modal = $modal.open(
			{
				template: html,
				keyboard: false
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

				modal.el = modalEl;
			}, 1);

			return modal;
		}

		function confirm(content, options)
		{
			return buildModal(content, true, true, (options || {}));
		}

		function alert(content, options)
		{
			return buildModal(content, true, false, (options || {}));
		}

		function input(content, options)
		{
			content += '<br/><br/><div class="form"><input class="form-control angular-notification-input" /></div>';
			var modal = buildModal(content, true, false, (options || {}));
			var deferred = $q.defer();

			modal.result.then(function()
			{
				var input = modal.el.find(".angular-notification-input").val();
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

		return {
			setTexts: setTexts,
			confirm: confirm,
			alert: alert,
			input: input
		};
	}];
});