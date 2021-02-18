define([
        'jquery',
        'uiComponent',
        'mage/validation',
        'ko',
        'Magento_Ui/js/modal/modal',
        'mage/url',
    ],
    function ($, Component, validation, ko, modal, urlBuilder) {
        'use strict';
        let title = "";
        return Component.extend({
            // employeeList: ko.observableArray([]),
            defaults: {
                template: 'Dtn_Knockout/list'
            },
            totalEmployee: ko.observableArray([]),
            initialize: function (config) {
                const self = this;
                this._super();
                // self.employee = ko.observableArray[self.employeeList];
                if (config.employeeList.length > 0) {
                    this.totalEmployee(config.employeeList);
                    return this;
                }
            },
            titles: function () {
                title = ko.observable("List Employee");
                return title;
            },

            // neu co id thi mo form edit, khong co thi mo from add
            createPopup: function (employee, event) {
                const popup = $("#employee-form-popup");
                if (employee.employee_id === null) {
                    // from add
                    let option = {
                        type: 'popup',
                        title: 'Add employee',
                        responsive: true,
                        clickableOverlay: true,
                        'buttons': [{
                            text: 'Cancel',
                            class: 'action',
                        }],
                        closed: function () {
                        }
                    };
                    modal(option, $(popup));
                    $(popup).modal("openModal");
                } else {
                    //from edit
                    const option = {
                        type: 'popup',
                        title: 'Edit Employee',
                        responsive: true,
                        clickableOverlay: true,
                        'buttons': [{
                            text: 'Cancel',
                            class: 'action',
                            click: function () {
                                $(popup).find("input").val("");
                                $(popup).find("select").val("");
                                this.closeModal();
                            }
                        }],
                        closed: function () {
                        }
                    };

                    modal(option, $(popup));
                    // du lieu tra ve moi cot khi edit
                    $(popup).find("input[name=employee_id]").val(employee.employee_id);
                    $(popup).find("input[name=firstname]").val(employee.firstname);
                    $(popup).find("input[name=lastname]").val(employee.lastname);
                    $(popup).find("input[name=email]").val(employee.email);
                    $(popup).find("input[name=dob]").val(employee.dob);
                    $(popup).find("input[name=salary]").val(employee.salary);
                    $(popup).find("select[name=department]").val(employee.department);
                    $(popup).find("input[name=note]").val(employee.note);
                    $(popup).modal("openModal");
                }

            },

            // add data
            save: function (data) {
                const url = urlBuilder.build("knockout/employee/create");
                const employee = {},
                    self = this,
                    //get all data
                    formDataArray = $(data).serializeArray();
                formDataArray.forEach(function (entry) {
                    employee[entry.name] = entry.value;
                });
                // console.log(formDataArray);
                //foreach saveData to {'key': 'value'}
                formDataArray.forEach(function (entry) {
                    employee[entry.name] = entry.value;
                });
                if ($(data).validation() && $(data).validation('isValid')) {
                    $.ajax({
                        url: url,
                        data: JSON.stringify(employee),
                        type: "POST",
                        dataType: 'json',
                    })
                        .done(
                            function (response) {
                                if (response) {
                                    $.each(response, function (i, v) {
                                        const indx = self.findIndex(self.totalEmployee(), v.employee_id);
                                        if (indx == -1) {
                                            self.totalEmployee.unshift(v);
                                        } else {
                                            const oldItem = self.totalEmployee()[indx];
                                            self.totalEmployee.replace(oldItem, v);
                                        }
                                    });
                                }
                            }
                        )
                    $('.action-close').click();
                }
            },
            //check ton tai
            findIndex: function (arr, id) {
                let ind = -1;
                arr.forEach(function (item, index) {
                    if (item.employee_id == id) {
                        ind = index;
                    }
                });
                return ind;
            },

            // xoa
            remove: function (item) {
                const url = urlBuilder.build("knockout/employee/delete");
                const confirm_delete = confirm('xoa la phai insert lai day nhe');
                const self = this;
                if (confirm_delete) {
                    const data = item;
                    $.ajax({
                        url: url,
                        data: data,
                        type: "POST",
                        dataType: 'json',
                    })
                        .done(
                            function (response) {
                                if (response) {
                                    self.totalEmployee.remove(function (employee) {
                                        return employee.employee_id == response.employee_id;
                                    });
                                }
                            }
                        )
                }
            },
        });
    }
);
