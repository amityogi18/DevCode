let _this;
import _ from 'lodash';

export class mailBoxController {
    /** @ngInject  */
    constructor($sce, mailBoxService, NgTableParams) {
        _this = this;
        _this.$sce = $sce;
        _this.mailBoxService = mailBoxService;
        _this.mailList = [];
        _this.countArr = [];
        _this.isLoaded = false;
        _this.isFirstLoad = true;
        if (window.mobile) {
            _this.countArr = [5, 10, 15];
        } else {
            _this.countArr = [10, 20, 30];
        }
        _this.mailTableParams = new NgTableParams({
            page: 1,
            count: window.mobile ? 5 : 10,
            filter: _this.searchFilter
        }, {
                counts: _this.countArr,
                getData: function (params) {
                    let filter = params.filter(),
                        sorting = params.sorting(),
                        count = params.count(),
                        page = params.page(),
                        filterFields = [],
                        sortFields = [],
                        queryString = '',
                        queryURL = '?';
                    angular.forEach(sorting, (value, key) => {
                        sortFields.push(`${key}&order=${value}`);
                    });
                    angular.forEach(filter, (value, key) => {
                        filterFields.push(`${key}=${value}`);
                    });
                    if (sortFields.length) {
                        queryString += `orderBy=${sortFields.join('&')}&`;
                    }
                    if (filterFields.length) {
                        queryString += filterFields.join('&');
                    }
                    queryURL += `${queryString}&limit=${count}&page=${page}`;

                    let onSuccess = (response) => {
                        _this.mailList = response.data.inbox;
                        _this.mailInfoMessage = response.data.Message;
                        _this.mailCount = response.data.count;
                        _this.isLoaded = true;
                        if (window.mobile) {
                            $(".mail-description-box").hide();
                            $(".backToInbox").hide();
                        }
                        if (_this.isFirstLoad === true) {
                            if (angular.isDefined(_this.mailList) && _this.mailList.length > 0) {
                                _this.getMailDetail = _this.mailList[0];
                            }
                            _this.isFirstLoad = false;
                        }
                        params.total(_this.mailCount);
                        return (_this.mailList);

                    },
                        onError = (error) => {
                            console.log(error);
                        };
                    _this.mailBoxService.getMailList(queryURL);
                    return _this.mailBoxService.activePromise.then(onSuccess, onError);
                }
            });
    }


    getMailById(mail) {
        _this.getMailDetail = mail;
        if (window.mobile) {
            $(".inbox-warapper").hide();
            $(".mail-description-box").show();
            $(".searchMail").hide();
            $(".backToInbox").show();
        }
        _.forEach(mail.attachment, function (value, key) {
            if (angular.isDefined(mail.attachment.files)) {
                mail.attachment.files.push({ path: value.filePath, name: value.name });
            } else {
                mail.attachment.files = [];
                mail.attachment.files.push({ path: value.filePath, name: value.name });
            }
        });
        _this.getMailDetail.textHtml = _this.$sce.trustAsHtml(mail.textHtml);

    }

    backToInbox() {
        $(".mail-description-box").hide();
        $(".searchMail").show();
        $(".backToInbox").hide();
        $(".inbox-warapper").show();
    }
}


