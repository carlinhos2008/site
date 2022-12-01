// Loading button plugin fix (removed from BS4)
(function ($) {
    $.fn.button = function (action) {
        if (action === 'loading' && this.data('loading-text')) {
            this.data('original-text', this.html()).html(this.data('loading-text')).prop('disabled', true);
        }
        if (action === 'reset' && this.data('original-text')) {
            this.html(this.data('original-text')).prop('disabled', false);
        }
    };
}(jQuery));

// Coin wizard validation (Frontpage)
const formDivisible = function () {
    return {
        validate: function (input) {
            const value = input.value;
            if (value === '') {
                return {
                    valid: true,
                };
            }

            if (parseInt(value) % parseInt($("#wallet_targetspacing").val())) {
                return {
                    valid: false,
                };
            }
            if (parseInt(value) < parseInt($("#wallet_targetspacing").val())) {
                return {
                    valid: false,
                };
            }

            return {
                valid: true,
            };
        },
    };
};

const formLessThan = function () {
    return {
        validate: function (input) {
            const value = input.value;
            if (value === '') {
                return {
                    valid: true,
                };
            }

            if (parseInt(value) > parseInt($("#wallet_blockreward").val())) {
                return {
                    valid: false,
                };
            }

            return {
                valid: true,
            };
        },
    };
};

const formGreaterThan = function () {
    return {
        validate: function (input) {
            const value = input.value;
            if (value === '') {
                return {
                    valid: true,
                };
            }

            if (parseInt(value) < parseInt($("#wallet_blockreward_pos").val())) {
                return {
                    valid: false,
                };
            }

            return {
                valid: true,
            };
        },
    };
};

const formCompare = function () {
    return {
        validate: function (input) {

            const value = input.value;
            const compareWith = 'function' === typeof input.options.compare ? input.options.compare.call(this) : input.options.compare;

            if (value === '') {
                return {
                    valid: true,
                };
            }

            if (value.toLocaleUpperCase("en") === compareWith.toLocaleUpperCase("en")) {
                return {
                    valid: false,
                };
            }

            return {
                valid: true,
            };
        },
    };
};

const formForbiddenName = function () {
    var forbiddenArrayName = ["TEST", "NA", "TEXT", "RIN", "BITCOIN", "BITCOINCORE"];

    return {
        validate: function (input) {
            const value = input.value;
            if (value === '') {
                return {
                    valid: true,
                };
            }

            if (forbiddenArrayName.includes(value.toLocaleUpperCase("en"))) {
                return {
                    valid: false,
                };
            }

            return {
                valid: true,
            };
        },
    };
};

const formForbiddenAbbreviation = function () {
    var forbiddenArrayAbbreviation = ["TEST", "SRC", "TRUE", "NT", "IN", "AVR", "NAN", "AC", "CON"];

    return {
        validate: function (input) {
            const value = input.value;
            if (value === '') {
                return {
                    valid: true,
                };
            }

            if (forbiddenArrayAbbreviation.includes(value.toLocaleUpperCase("en"))) {
                return {
                    valid: false,
                };
            }

            return {
                valid: true,
            };
        },
    };
};

FormValidation.validators.checkDivisible = formDivisible;
FormValidation.validators.checkLessThan = formLessThan;
FormValidation.validators.checkGreaterThan = formGreaterThan;
FormValidation.validators.checkCompare = formCompare;
FormValidation.validators.checkForbiddenName = formForbiddenName;
FormValidation.validators.checkForbiddenAbbreviation = formForbiddenAbbreviation;

document.addEventListener('DOMContentLoaded', function (e) {
    const form = document.getElementById('purchase-form');
    const step1 = form.querySelector('.js-step[data-step="1"]');
    const step2 = form.querySelector('.js-step[data-step="2"]');
    const step3 = form.querySelector('.js-step[data-step="3"]');
    const step4 = form.querySelector('.js-step[data-step="4"]');
    const step5 = form.querySelector('.js-step[data-step="5"]');
    const prevButton = form.querySelector('[id="prevButton"]');
    const nextButton = form.querySelector('[id="nextButton"]');
    let currentStep = 1;
    const fv1 = FormValidation
            .formValidation(
                    step1,
                    {
                        fields: {
                            purchase_email: {
                                validators: {
                                    notEmpty: {
                                        message: 'Enter a valid email address.'
                                    },
                                    emailAddress: {
                                        message: 'Enter a valid email address.'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            icon: new FormValidation.plugins.Icon({
                                valid: 'fa fa-check',
                                invalid: 'fa fa-times',
                                validating: 'fa fa-refresh'
                            }),
                        },
                    }
            )
            .on('core.form.valid', function () {
                // Jump to the next step when all fields in the current step are valid
                currentStep++;
                nextButton.innerHTML = 'Next';
                // Hide the first step
                FormValidation.utils.classSet(step1, {
                    'js-step-active': false,
                });
                // Show the next step
                FormValidation.utils.classSet(step2, {
                    'js-step-active': true,
                });
                // Hide the first tab header
                FormValidation.utils.classSet(document.getElementById('tab1-header'), {
                    'active': false,
                });
                // Show the next tab header
                FormValidation.utils.classSet(document.getElementById('tab2-header'), {
                    'active': true,
                });
                // Show prev button
                FormValidation.utils.classSet(document.getElementById('prevButton'), {
                    'btn-wb-hidden': false,
                });
                document.getElementById("tab2").scrollIntoView();
            });
    const fv2 = FormValidation
            .formValidation(
                    step2,
                    {
                        fields: {
                            wallet_name: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Coin name” value canot be empty.'
                                    },
                                    stringLength: {
                                        min: 2,
                                        max: 255,
                                        message: 'The “Coin name” value must be at least 2 characters with a maximum of 255 characters.'
                                    },
                                    checkForbiddenName: {
                                        message: 'The “Coin name” value cannot be used.'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z][a-zA-Z0-9]+$/i,
                                        message: 'The “Coin name” value can only consist of alphabetical characters.'
                                    }
                                }
                            },
                            wallet_abbreviation: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Coin abbreviation” value cannot be empty.'
                                    },
                                    stringLength: {
                                        min: 2,
                                        max: 6,
                                        message: 'The “Coin abbreviation” value must be at least 2 characters with a maximum of 6 characters.'
                                    },
                                    checkForbiddenAbbreviation: {
                                        message: 'The “Coin abbreviation” value cannot be used.'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z][a-zA-Z0-9]+$/i,
                                        message: 'The “Coin abbreviation” value can only consist of alphabetical characters.'
                                    },
                                    checkCompare: {
                                        enabled: false,
                                        compare: function () {
                                            return form.querySelector('[name="wallet_name"]').value;
                                        },
                                        message: 'The “Coin abbreviation” value cannot be the same as the “Coin name” value.'
                                    }
                                }
                            },
                            wallet_unit: {
                                validators: {
                                    notEmpty: {
                                        enabled: false,
                                        message: 'The “Coin unit” value cannot be empty.'
                                    },
                                    stringLength: {
                                        enabled: false,
                                        min: 1,
                                        max: 15,
                                        message: 'The “Coin unit” value must be at least 1 character.'
                                    },
                                    regexp: {
                                        enabled: false,
                                        regexp: /^[abcdefghijklnopqrstvwxyzABCDEFGHIJKLNOPQRSTVWXYZ][a-zA-Z0-9]+$/i,
                                        message: 'The “Coin unit” value can only consist of alphabetical characters.'
                                    },
                                    checkCompare: {
                                        enabled: false,
                                        compare: function () {
                                            return form.querySelector('[name="wallet_abbreviation"]').value;
                                        },
                                        message: 'The “Coin unit” value cannot be the same as the “Coin abbreviation” value.'
                                    }
                                }
                            },
                            wallet_timestamp: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Verbal timestamp” value cannot be empty.'
                                    },
                                    stringLength: {
                                        min: 2,
                                        max: 70,
                                        message: 'The “Verbal timestamp” value must be at least 3 characters with a maximum of 70 characters.'
                                    },
                                    regexp: {
                                        regexp: /^[a-z0-9\s]+$/i,
                                        message: 'The “Verbal timestamp” value can only consist of alphabetical characters, and spaces.'
                                    }
                                }
                            },
                            wallet_website: {
                                validators: {
                                    uri: {
                                        message: 'The “Website URL” value is not valid.'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9:/.]+$/i,
                                        message: 'The “Website URL” value can only consist of alphabetical characters and the special characters ":/.".'
                                    }
                                }
                            },
                            wallet_github: {
                                validators: {
                                    uri: {
                                        message: 'The “Github URL” value is not valid.'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9:/.]+$/i,
                                        message: 'The “Github URL” value can only consist of alphabetical characters and the special characters ":/.".'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            icon: new FormValidation.plugins.Icon({
                                valid: 'fa fa-check',
                                invalid: 'fa fa-times',
                                validating: 'fa fa-refresh'
                            }),
                        },
                    }
            )
            .on('core.form.valid', function () {
                // Jump to the next step when all fields in the current step are valid
                currentStep++;
                nextButton.innerHTML = 'Next';
                // Hide the first step
                FormValidation.utils.classSet(step2, {
                    'js-step-active': false,
                });
                // Show the next step
                FormValidation.utils.classSet(step3, {
                    'js-step-active': true,
                });
                // Hide the first tab header
                FormValidation.utils.classSet(document.getElementById('tab2-header'), {
                    'active': false,
                });
                // Show the next tab header
                FormValidation.utils.classSet(document.getElementById('tab3-header'), {
                    'active': true,
                });
                document.getElementById("tab3").scrollIntoView();
            });
    const fv3 = FormValidation
            .formValidation(
                    step3,
                    {
                        fields: {
                            wallet_lastpowblock_pos: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Last PoW block” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Last PoW block” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1000,
                                        max: 100000000,
                                        message: 'The “Last PoW block” value must be a number between 1000 and 100000000.'
                                    }
                                }
                            },
                            wallet_blockreward: {
                                validators: {
                                    notEmpty: {
                                        enabled: true,
                                        message: 'The “Block reward” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Block reward” value can only consist of digits.'
                                    },
                                    checkGreaterThan: {
                                        enabled: false,
                                        message: 'The “Block reward” value must be greater or equal to the “Block reward (PoS)” value.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 10000,
                                        message: 'The “Block reward” value must be a number between 1 and 10000.'
                                    }
                                }
                            },
                            wallet_blockreward_pos: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Block reward (PoS)” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Block reward (PoS)” value can only consist of digits.'
                                    },
                                    checkLessThan: {
                                        enabled: false,
                                        message: 'The “Block reward (PoS)” value must be less or equal to the “Block reward” value.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 10000,
                                        message: 'The “Block reward (PoS)” value must be a number between 1 and 10000.'
                                    }
                                }
                            },
                            wallet_masternode_reward: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Masternode reward” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Masternode reward” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 99,
                                        message: 'The “Masternode reward” value must be a number between 1 and 99.'
                                    }
                                }
                            },
                            wallet_superblock_reward: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Superblock reward” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Superblock reward” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 99,
                                        message: 'The “Superblock reward” value must be a number between 1 and 99.'
                                    }
                                }
                            },
                            wallet_subsidy: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Block halving” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Block halving” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 10,
                                        max: 4000000,
                                        message: 'The “Block halving” value must be number between 10 and 4000000.'
                                    }
                                }
                            },
                            wallet_maxmoney: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Coin supply” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Coin supply” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 10,
                                        max: 9999999999,
                                        message: 'The “Coin supply” value must be a number between 10 and 9999999999.'
                                    }
                                }
                            },
                            wallet_premineamount: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Premine amount” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Premine amount” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 0,
                                        max: 9999999999,
                                        message: 'The “Premine amount” value must be a number between 1 and 9999999999.'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            icon: new FormValidation.plugins.Icon({
                                valid: 'fa fa-check',
                                invalid: 'fa fa-times',
                                validating: 'fa fa-refresh'
                            }),
                        },
                    }
            )
            .on('core.form.valid', function () {
                // Jump to the next step when all fields in the current step are valid
                currentStep++;
                nextButton.innerHTML = 'Next';
                // Hide the first step
                FormValidation.utils.classSet(step3, {
                    'js-step-active': false,
                });
                // Show the next step
                FormValidation.utils.classSet(step4, {
                    'js-step-active': true,
                });
                // Hide the first tab header
                FormValidation.utils.classSet(document.getElementById('tab3-header'), {
                    'active': false,
                });
                // Show the next tab header
                FormValidation.utils.classSet(document.getElementById('tab4-header'), {
                    'active': true,
                });
                document.getElementById("tab4").scrollIntoView();
            });
    const fv4 = FormValidation
            .formValidation(
                    step4,
                    {
                        fields: {
                            wallet_minstakeage: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Minimum coin age” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Minimum coin age” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 1000,
                                        message: 'The “Minimum coin age” value must be a number between 1 and 1000.'
                                    }
                                }
                            },
                            wallet_maturity: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Coinbase maturity” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Coinbase maturity” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 100,
                                        message: 'The “Coinbase maturity” value must be a number between 1 and 100.'
                                    }
                                }
                            },
                            wallet_confirmations: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Number of confirmations” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Number of confirmations” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 100,
                                        message: 'The “Number of confirmations” value must be a number between 1 and 100.'
                                    }
                                }
                            },
                            wallet_targettimespan: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Target timespan in minutes” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Target timespan in minutes” value can only consist of digits.'
                                    },
                                    checkDivisible: {
                                        message: 'The “Target timespan in minutes” value must be divisible by the “Target spacing in minutes” value.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 120,
                                        message: 'The “Target timespan in minutes” value must be a number between 1 and 120.'
                                    }
                                }
                            },
                            wallet_targetspacing: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Target spacing in minutes” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Target spacing in minutes” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 120,
                                        message: 'The “Target spacing in minutes” value must be a number between 1 and 120.'
                                    }
                                }
                            },
                            wallet_masternode_amount: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Masternode amount” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Masternode amount” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 1000000000,
                                        message: 'The “Masternode amount” value must be a number between 1 and 1000000000.'
                                    }
                                }
                            },
                            wallet_masternode_confirmations: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Masternode confirmations” value cannot be empty.'
                                    },
                                    digits: {
                                        message: 'The “Masternode confirmations” value can only consist of digits.'
                                    },
                                    between: {
                                        min: 1,
                                        max: 1000,
                                        message: 'The “Masternode confirmations” value must be a number between 1 and 1000.'
                                    }
                                }
                            },
                            wallet_seednodeip0: {
                                validators: {
                                    notEmpty: {
                                        message: 'The “Node 1” value cannot be empty.'
                                    },
                                    regexp: {
                                        regexp: /^[a-z0-9.-]+$/i,
                                        message: 'The “Node 1” value can only consist of alphabetical characters.'
                                    }
                                }
                            },
                            wallet_seednodeip1: {
                                validators: {
                                    regexp: {
                                        regexp: /^[a-z0-9.-]+$/i,
                                        message: 'The “Node 2” value can only consist of alphabetical characters.'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            icon: new FormValidation.plugins.Icon({
                                valid: 'fa fa-check',
                                invalid: 'fa fa-times',
                                validating: 'fa fa-refresh'
                            }),
                        },
                    }
            )
            .on('core.form.valid', function () {
                // Jump to the next step when all fields in the current step are valid
                currentStep++;
                nextButton.innerHTML = 'Purchase';
                // Hide the first step
                FormValidation.utils.classSet(step4, {
                    'js-step-active': false,
                });
                // Show the next step
                FormValidation.utils.classSet(step5, {
                    'js-step-active': true,
                });
                // Hide the first tab header
                FormValidation.utils.classSet(document.getElementById('tab4-header'), {
                    'active': false,
                });
                // Show the next tab header
                FormValidation.utils.classSet(document.getElementById('tab5-header'), {
                    'active': true,
                });
                document.getElementById("tab5").scrollIntoView();
            });
    const fv5 = FormValidation
            .formValidation(
                    step5,
                    {
                        fields: {
                            ImageSplash: {
                                validators: {
                                    notEmpty: {
                                        enabled: false,
                                        message: 'Select a PNG image for the splash screen of your wallet.'
                                    },
                                    file: {
                                        enabled: false,
                                        extension: 'png',
                                        type: 'image/png',
                                        maxSize: 8388608, // 8192 * 1024
                                        message: 'The “Wallet splash” image must be a PNG file.'
                                    },
                                    promise: {
                                        enabled: false,
                                        promise: function (input) {
                                            return new Promise(function (resolve, reject) {
                                                const files = input.element.files
                                                if (!files.length || typeof FileReader === 'undefined') {
                                                    resolve({
                                                        valid: true
                                                    });
                                                }

                                                const img = new Image();
                                                img.addEventListener('load', function () {
                                                    const w = this.width;
                                                    const h = this.height;
                                                    resolve({
                                                        valid: (w >= image_splash_min_width && h >= image_splash_min_height),
                                                        message: 'The dimensions of the “Wallet splash” image must be greater or equal to width: ' + image_splash_min_width + ' px and height: ' + image_splash_min_height + ' px.',
                                                        meta: {
                                                            source: img.src,
                                                            width: w,
                                                            height: h,
                                                        },
                                                    });
                                                });
                                                img.addEventListener('error', function () {
                                                    reject({
                                                        valid: false,
                                                        message: 'Select a PNG image for the splash screen of your wallet.',
                                                    });
                                                });
                                                const reader = new FileReader();
                                                reader.readAsDataURL(files[0]);
                                                reader.addEventListener('loadend', function (e) {
                                                    img.src = e.target.result;
                                                });
                                            });
                                        }
                                    }
                                }
                            },
                            ImageSplashTestnet: {
                                validators: {
                                    notEmpty: {
                                        enabled: false,
                                        message: 'Select a PNG image for the testnet splash screen of your wallet.'
                                    },
                                    file: {
                                        enabled: false,
                                        extension: 'png',
                                        type: 'image/png',
                                        maxSize: 8388608, // 8192 * 1024
                                        message: 'The “Wallet testnet splash” image must be a PNG file.'
                                    },
                                    promise: {
                                        enabled: false,
                                        promise: function (input) {
                                            return new Promise(function (resolve, reject) {
                                                const files = input.element.files
                                                if (!files.length || typeof FileReader === 'undefined') {
                                                    resolve({
                                                        valid: true
                                                    });
                                                }

                                                const img = new Image();
                                                img.addEventListener('load', function () {
                                                    const w = this.width;
                                                    const h = this.height;
                                                    resolve({
                                                        valid: (w >= image_splash_testnet_min_width && h >= image_splash_testnet_min_height),
                                                        message: 'The dimensions of the “Wallet testnet splash” image must be greater or equal to width: ' + image_splash_testnet_min_width + ' px and height: ' + image_splash_testnet_min_height + ' px.',
                                                        meta: {
                                                            source: img.src,
                                                            width: w,
                                                            height: h,
                                                        },
                                                    });
                                                });
                                                img.addEventListener('error', function () {
                                                    reject({
                                                        valid: false,
                                                        message: 'Select a PNG image for the testnet splash screen of your wallet.',
                                                    });
                                                });
                                                const reader = new FileReader();
                                                reader.readAsDataURL(files[0]);
                                                reader.addEventListener('loadend', function (e) {
                                                    img.src = e.target.result;
                                                });
                                            });
                                        }
                                    }
                                }
                            },
                            ImageIcon: {
                                validators: {
                                    notEmpty: {
                                        enabled: false,
                                        message: 'Select a PNG image for the icon of your wallet.'
                                    },
                                    file: {
                                        enabled: false,
                                        extension: 'png',
                                        type: 'image/png',
                                        maxSize: 8388608, // 8192 * 1024
                                        message: 'The “Wallet icon” image must be a PNG file.'
                                    },
                                    promise: {
                                        enabled: false,
                                        promise: function (input) {
                                            return new Promise(function (resolve, reject) {
                                                const files = input.element.files
                                                if (!files.length || typeof FileReader === 'undefined') {
                                                    resolve({
                                                        valid: true
                                                    });
                                                }

                                                const img = new Image();
                                                img.addEventListener('load', function () {
                                                    const w = this.width;
                                                    const h = this.height;
                                                    resolve({
                                                        valid: (w >= image_icon_min_width && h >= image_icon_min_height),
                                                        message: 'The dimensions of the “Wallet icon” image must be greater or equal to width: ' + image_icon_min_width + ' px and height: ' + image_icon_min_height + ' px.',
                                                        meta: {
                                                            source: img.src,
                                                            width: w,
                                                            height: h,
                                                        },
                                                    });
                                                });
                                                img.addEventListener('error', function () {
                                                    reject({
                                                        valid: false,
                                                        message: 'Select a PNG image for the icon of your wallet.',
                                                    });
                                                });
                                                const reader = new FileReader();
                                                reader.readAsDataURL(files[0]);
                                                reader.addEventListener('loadend', function (e) {
                                                    img.src = e.target.result;
                                                });
                                            });
                                        }
                                    }
                                }
                            },
                            ImageIconTestnet: {
                                validators: {
                                    notEmpty: {
                                        enabled: false,
                                        message: 'Select a PNG image for the testnet icon of your wallet.'
                                    },
                                    file: {
                                        enabled: false,
                                        extension: 'png',
                                        type: 'image/png',
                                        maxSize: 8388608, // 8192 * 1024
                                        message: 'The “Wallet testnet icon” image must be a PNG file.'
                                    },
                                    promise: {
                                        enabled: false,
                                        promise: function (input) {
                                            return new Promise(function (resolve, reject) {
                                                const files = input.element.files
                                                if (!files.length || typeof FileReader === 'undefined') {
                                                    resolve({
                                                        valid: true
                                                    });
                                                }

                                                const img = new Image();
                                                img.addEventListener('load', function () {
                                                    const w = this.width;
                                                    const h = this.height;
                                                    resolve({
                                                        valid: (w >= image_icon_testnet_min_width && h >= image_icon_testnet_min_height),
                                                        message: 'The dimensions of the “Wallet testnet icon” image must be greater or equal to width: ' + image_icon_testnet_min_width + ' px and height: ' + image_icon_testnet_min_height + ' px.',
                                                        meta: {
                                                            source: img.src,
                                                            width: w,
                                                            height: h,
                                                        },
                                                    });
                                                });
                                                img.addEventListener('error', function () {
                                                    reject({
                                                        valid: false,
                                                        message: 'Select a PNG image for the testnet icon of your wallet.',
                                                    });
                                                });
                                                const reader = new FileReader();
                                                reader.readAsDataURL(files[0]);
                                                reader.addEventListener('loadend', function (e) {
                                                    img.src = e.target.result;
                                                });
                                            });
                                        }
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            submitButton: new FormValidation.plugins.SubmitButton(),
                            icon: new FormValidation.plugins.Icon({
                                valid: 'fa fa-check',
                                invalid: 'fa fa-times',
                                validating: 'fa fa-refresh'
                            }),
                        },
                    }
            )
            .on('core.form.valid', function () {

                $("#nextButton").button('loading');
                $.ajax({
                    url: "/include/ajax/ajax.purchase.wizard.php",
                    dataType: 'text',
                    data: new FormData($('#purchase-form')[0]),
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (data) {
                        //console.log(data);
                        if (data === 'status_code_1') {
                            $('#purchase-content').load("/include/ajax/ajax.purchase.status.php?status_code=1");
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        if (data === 'status_code_2') {
                            $('#purchase-content').load("/include/ajax/ajax.purchase.status.php?status_code=2");
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        if (data === 'status_code_3') {
                            $('#purchase-content').load("/include/ajax/ajax.purchase.status.php?status_code=3");
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        if (data === 'status_code_4') {
                            $('#purchase-content').load("/include/ajax/ajax.purchase.status.php?status_code=4");
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        if (data === 'status_code_5') {
                            $('#purchase-content').load("/include/ajax/ajax.purchase.status.php?status_code=5");
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        if (data === 'status_code_6') {
                            $('#purchase-content').load("/include/ajax/ajax.purchase.status.php?status_code=6");
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        if (data === 'status_code_7') {
                            $('#purchase-content').load("/include/ajax/ajax.purchase.status.php?status_code=7");
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        if (data === 'status_code_8') {
                            $('#purchase-content').load("/include/ajax/ajax.purchase.status.php?status_code=8");
                            window.scrollTo(0, document.body.scrollHeight);
                        }
                        $("#nextButton").button('reset');
                    }
                });
            });
    nextButton.addEventListener('click', function () {
        // When click the Next button, we will validate the current step
        switch (currentStep) {
            case 1:
                fv1.validate();
                break;
            case 2:
                fv2.validate();
                break;
            case 3:
                fv3.validate();
                break;
            case 4:
                fv4.validate();
                break;
            case 5:
                if ($('#purchase_type').val() === "free") {

                    $.getJSON('/include/json/queue_information.php?purchase_status=compile_linux&free=1', function (QueueTotal) {
                        if (QueueTotal < 10) {
                            var purchase_queue_email = $('#purchase_email').val();

                            $.getJSON('/include/json/queue_status.php?email=' + purchase_queue_email, function (QueueStatus) {
                                if (QueueStatus === 4) {
                                    fv5.validate();
                                }
                                if (QueueStatus === 1) {
                                    $(".wb-order-status").html("<div class=\"alert alert-warning\" role=\"alert\">Coin order is not accepted, your email address and IP address have already been used to create a free coin.</div>");
                                }
                                if (QueueStatus === 2) {
                                    $(".wb-order-status").html("<div class=\"alert alert-warning\" role=\"alert\">Coin order is not accepted, your IP address has already been used to create a free coin.</div>");
                                }
                                if (QueueStatus === 3) {
                                    $(".wb-order-status").html("<div class=\"alert alert-warning\" role=\"alert\">Coin order is not accepted, your email address has already been used to create a free coin.</div>");
                                }
                            });
                        }
                        if (QueueTotal >= 10) {
                            $(".wb-order-status").html("<div class=\"alert alert-warning\" role=\"alert\">Coin order is not accepted, free coin queue status: <strong>" + QueueTotal + "/10</strong></div>");
                        }
                    });
                }
                if ($('#purchase_type').val() === "paid") {
                    fv5.validate();
                }
                break;
            default:
                break;
        }
    });
    prevButton.addEventListener('click', function () {
        switch (currentStep) {
            case 5:
                currentStep--;
                nextButton.innerHTML = 'Next';
                // Hide the second step
                FormValidation.utils.classSet(step5, {
                    'js-step-active': false,
                });
                // Show the first step
                FormValidation.utils.classSet(step4, {
                    'js-step-active': true,
                });
                // Hide the first tab header
                FormValidation.utils.classSet(document.getElementById('tab5-header'), {
                    'active': false,
                });
                // Show the next tab header
                FormValidation.utils.classSet(document.getElementById('tab4-header'), {
                    'active': true,
                });
                break;
            case 4:
                currentStep--;
                nextButton.innerHTML = 'Next';
                // Hide the second step
                FormValidation.utils.classSet(step4, {
                    'js-step-active': false,
                });
                // Show the first step
                FormValidation.utils.classSet(step3, {
                    'js-step-active': true,
                });
                // Hide the first tab header
                FormValidation.utils.classSet(document.getElementById('tab4-header'), {
                    'active': false,
                });
                // Show the next tab header
                FormValidation.utils.classSet(document.getElementById('tab3-header'), {
                    'active': true,
                });
                break;
            case 3:
                currentStep--;
                nextButton.innerHTML = 'Next';
                // Hide the second step
                FormValidation.utils.classSet(step3, {
                    'js-step-active': false,
                });
                // Show the first step
                FormValidation.utils.classSet(step2, {
                    'js-step-active': true,
                });
                // Hide the first tab header
                FormValidation.utils.classSet(document.getElementById('tab3-header'), {
                    'active': false,
                });
                // Show the next tab header
                FormValidation.utils.classSet(document.getElementById('tab2-header'), {
                    'active': true,
                });
                break;
            case 2:
                currentStep--;
                nextButton.innerHTML = 'Next';
                // Hide the second step
                FormValidation.utils.classSet(step2, {
                    'js-step-active': false,
                });
                // Show the first step
                FormValidation.utils.classSet(step1, {
                    'js-step-active': true,
                });
                // Hide the first tab header
                FormValidation.utils.classSet(document.getElementById('tab2-header'), {
                    'active': false,
                });
                // Show the next tab header
                FormValidation.utils.classSet(document.getElementById('tab1-header'), {
                    'active': true,
                });
                // Show prev button
                FormValidation.utils.classSet(document.getElementById('prevButton'), {
                    'btn-wb-hidden': true,
                });
                break;
            case 1:
            default:
                break;
        }
    });
    form.querySelector('[name="Premine100percent"]').addEventListener('change', function (e) {

        if (this.checked) {
            fv3
                    .disableValidator('wallet_blockreward', 'between')
                    .revalidateField('wallet_blockreward');
        } else {
            fv3
                    .enableValidator('wallet_blockreward', 'between')
                    .revalidateField('wallet_blockreward');
        }
    });
    form.querySelector('[name="purchase_type"]').addEventListener('change', function (e) {
        fv3
                .enableValidator('wallet_blockreward', 'between')
                .revalidateField('wallet_blockreward');
    });
    form.querySelector('[name="purchase_type"]').addEventListener('change', function (e) {

        if (this.value === "free") {
            fv5
                    .disableValidator('ImageSplash', 'notEmpty')
                    .disableValidator('ImageSplash', 'file');
            fv5
                    .disableValidator('ImageSplashTestnet', 'notEmpty')
                    .disableValidator('ImageSplashTestnet', 'file');
            fv5
                    .disableValidator('ImageIcon', 'notEmpty')
                    .disableValidator('ImageIcon', 'file');
            fv5
                    .disableValidator('ImageIconTestnet', 'notEmpty')
                    .disableValidator('ImageIconTestnet', 'file');
        }

        if (this.value === "paid") {
            if ((form.querySelector('[name="wallet_type"]').value === "scrypt-pow") || (form.querySelector('[name="wallet_type"]').value === "sha256-pow")) {

                // minimum dimensions 1024px x 1024px
                image_icon_min_height = 1024;
                image_icon_min_width = 1024;
                $("#ImageIconHelp").html("Select a PNG image for the icon of your wallet.<br />Preferred image size: W: 1024px | H: 1024px.");
                // minimum dimensions 1024px x 1024px
                image_icon_testnet_min_height = 1024;
                image_icon_testnet_min_width = 1024;
                $("#ImageIconTestnetHelp").html("Select a PNG image for the testnet icon of your wallet.<br />Preferred image size: W: 1024px | H: 1024px.");
                fv5
                        .disableValidator('ImageSplash', 'notEmpty')
                        .disableValidator('ImageSplash', 'file')
                        .disableValidator('ImageSplash', 'promise');
                fv5
                        .disableValidator('ImageSplashTestnet', 'notEmpty')
                        .disableValidator('ImageSplashTestnet', 'file')
                        .disableValidator('ImageSplashTestnet', 'promise');
                fv5
                        .enableValidator('ImageIcon', 'notEmpty')
                        .enableValidator('ImageIcon', 'file')
                        .enableValidator('ImageIcon', 'promise');
                fv5
                        .enableValidator('ImageIconTestnet', 'notEmpty')
                        .enableValidator('ImageIconTestnet', 'file')
                        .enableValidator('ImageIconTestnet', 'promise');
            }
            if ((form.querySelector('[name="wallet_type"]').value === "x11-pow") || (form.querySelector('[name="wallet_type"]').value === "scrypt-pos") || (form.querySelector('[name="wallet_type"]').value === "quark-pos")) {

                // minimum dimensions 1024px x 1024px
                image_icon_min_height = 1024;
                image_icon_min_width = 1024;
                $("#ImageIconHelp").html("Select a PNG image for the icon of your wallet.<br />Preferred image size: W: 1024px | H: 1024px.");
                // minimum dimensions 1024px x 1024px
                image_icon_testnet_min_height = 1024;
                image_icon_testnet_min_width = 1024;
                $("#ImageIconTestnetHelp").html("Select a PNG image for the testnet icon of your wallet.<br />Preferred image size: W: 1024px | H: 1024px.");
                if (form.querySelector('[name="wallet_type"]').value === "x11-pow") {
                    // minimum dimensions 540px x 480px
                    image_splash_min_height = 540;
                    image_splash_min_width = 480;
                    $("#ImageSplashHelp").html("Select a PNG image for the splash screen of your wallet.<br />Preferred image size: W: 480px | H: 540px.");
                    // minimum dimensions 540px x 480px
                    image_splash_testnet_min_height = 540;
                    image_splash_testnet_min_width = 480;
                    $("#ImageSplashTestnetHelp").html("Select a PNG image for the testnet splash screen of your wallet.<br />Preferred image size: W: 480px | H: 540px.");
                }

                if (form.querySelector('[name="wallet_type"]').value === "quark-pos") {
                    // minimum dimensions 550px x 480px
                    image_splash_min_height = 550;
                    image_splash_min_width = 480;
                    $("#ImageSplashHelp").html("Select a PNG image for the splash screen of your wallet.<br />Preferred image size: W: 480px | H: 550px.");
                    // minimum dimensions 550px x 480px
                    image_splash_testnet_min_height = 550;
                    image_splash_testnet_min_width = 480;
                    $("#ImageSplashTestnetHelp").html("Select a PNG image for the testnet splash screen of your wallet.<br />Preferred image size: W: 480px | H: 550px.");
                }

                if (form.querySelector('[name="wallet_type"]').value === "scrypt-pos") {
                    // minimum dimensions 220px x 300px
                    image_splash_min_height = 220;
                    image_splash_min_width = 300;
                    $("#ImageSplashHelp").html("Select a PNG image for the splash screen of your wallet.<br />Preferred image size: W: 300px | H: 220px.");
                    // minimum dimensions 220px x 300px
                    image_splash_testnet_min_height = 220;
                    image_splash_testnet_min_width = 300;
                    $("#ImageSplashTestnetHelp").html("Select a PNG image for the testnet splash screen of your wallet.<br />Preferred image size: W: 300px | H: 220px.");
                }


                fv5
                        .enableValidator('ImageSplash', 'notEmpty')
                        .enableValidator('ImageSplash', 'file')
                        .enableValidator('ImageSplash', 'promise');
                fv5
                        .enableValidator('ImageSplashTestnet', 'notEmpty')
                        .enableValidator('ImageSplashTestnet', 'file')
                        .enableValidator('ImageSplashTestnet', 'promise');
                fv5
                        .enableValidator('ImageIcon', 'notEmpty')
                        .enableValidator('ImageIcon', 'file')
                        .enableValidator('ImageIcon', 'promise');
                fv5
                        .enableValidator('ImageIconTestnet', 'notEmpty')
                        .enableValidator('ImageIconTestnet', 'file')
                        .enableValidator('ImageIconTestnet', 'promise');
            }
        }

    });
    form.querySelector('[name="wallet_type"]').addEventListener('change', function (e) {
        if (this.value === "quark-pos") {
            fv3
                    .enableValidator('wallet_blockreward', 'checkGreaterThan')
                    .revalidateField('wallet_blockreward');
            fv3
                    .enableValidator('wallet_blockreward_pos', 'checkLessThan')
                    .revalidateField('wallet_blockreward_pos');
        }
        if ((this.value === "scrypt-pow") || (this.value === "scrypt-pos") || (this.value === "sha256-pow") || (this.value === "x11-pow")) {
            fv3
                    .disableValidator('wallet_blockreward', 'checkGreaterThan')
                    .revalidateField('wallet_blockreward');
            fv3
                    .disableValidator('wallet_blockreward_pos', 'checkLessThan')
                    .revalidateField('wallet_blockreward_pos');
        }
        if (this.value === "quark-pos") {
            fv2
                    .enableValidator('wallet_abbreviation', 'checkCompare');
        }
        if ((this.value === "scrypt-pow") || (this.value === "scrypt-pos") || (this.value === "sha256-pow") || (this.value === "x11-pow")) {
            fv2
                    .disableValidator('wallet_abbreviation', 'checkCompare');
        }
        if (this.value === "quark-pos") {
            fv3
                    .disableValidator('wallet_maxmoney', 'notEmpty')
                    .disableValidator('wallet_maxmoney', 'digits')
                    .disableValidator('wallet_maxmoney', 'between')
                    .revalidateField('wallet_maxmoney');
        }
        if ((this.value === "scrypt-pow") || (this.value === "sha256-pow") || (this.value === "x11-pow")) {
            fv3
                    .enableValidator('wallet_maxmoney', 'notEmpty')
                    .enableValidator('wallet_maxmoney', 'digits')
                    .enableValidator('wallet_maxmoney', 'between')
                    .revalidateField('wallet_maxmoney');
        }
        if ((this.value === "scrypt-pow") || (this.value === "scrypt-pos") || (this.value === "quark-pos")) {
            fv2
                    .disableValidator('wallet_unit', 'notEmpty')
                    .disableValidator('wallet_unit', 'stringLength')
                    .disableValidator('wallet_unit', 'regexp')
                    .disableValidator('wallet_unit', 'checkCompare');
        }
        if ((this.value === "sha256-pow") || (this.value === "x11-pow")) {
            fv2
                    .enableValidator('wallet_unit', 'notEmpty')
                    .enableValidator('wallet_unit', 'stringLength')
                    .enableValidator('wallet_unit', 'regexp')
                    .enableValidator('wallet_unit', 'checkCompare');
        }
        if (form.querySelector('[name="purchase_type"]').value === "paid") {
            if ((this.value === "scrypt-pow") || (this.value === "sha256-pow")) {

                // minimum dimensions 1024px x 1024px
                image_icon_min_height = 1024;
                image_icon_min_width = 1024;
                $("#ImageIconHelp").html("Select a PNG image for the icon of your wallet.<br />Preferred image size: W: 1024px | H: 1024px.");
                // minimum dimensions 1024px x 1024px
                image_icon_testnet_min_height = 1024;
                image_icon_testnet_min_width = 1024;
                $("#ImageIconTestnetHelp").html("Select a PNG image for the testnet icon of your wallet.<br />Preferred image size: W: 1024px | H: 1024px.");
                fv5
                        .disableValidator('ImageSplash', 'notEmpty')
                        .disableValidator('ImageSplash', 'file')
                        .disableValidator('ImageSplash', 'promise');
                fv5
                        .disableValidator('ImageSplashTestnet', 'notEmpty')
                        .disableValidator('ImageSplashTestnet', 'file')
                        .disableValidator('ImageSplashTestnet', 'promise');
                fv5
                        .enableValidator('ImageIcon', 'notEmpty')
                        .enableValidator('ImageIcon', 'file')
                        .enableValidator('ImageIcon', 'promise');
                fv5
                        .enableValidator('ImageIconTestnet', 'notEmpty')
                        .enableValidator('ImageIconTestnet', 'file')
                        .enableValidator('ImageIconTestnet', 'promise');
            }
            if ((this.value === "x11-pow") || (this.value === "scrypt-pos") || (this.value === "quark-pos")) {

                if (this.value === "x11-pow") {
                    // minimum dimensions 540px x 480px
                    image_splash_min_height = 540;
                    image_splash_min_width = 480;
                    $("#ImageSplashHelp").html("Select a PNG image for the splash screen of your wallet.<br />Preferred image size: W: 480px | H: 540px.");
                    // minimum dimensions 540px x 480px
                    image_splash_testnet_min_height = 540;
                    image_splash_testnet_min_width = 480;
                    $("#ImageSplashTestnetHelp").html("Select a PNG image for the testnet splash screen of your wallet.<br />Preferred image size: W: 480px | H: 540px.");
                }

                if (this.value === "quark-pos") {
                    // minimum dimensions 550px x 480px
                    image_splash_min_height = 550;
                    image_splash_min_width = 480;
                    $("#ImageSplashHelp").html("Select a PNG image for the splash screen of your wallet.<br />Preferred image size: W: 480px | H: 550px.");
                    // minimum dimensions 550px x 480px
                    image_splash_testnet_min_height = 550;
                    image_splash_testnet_min_width = 480;
                    $("#ImageSplashTestnetHelp").html("Select a PNG image for the testnet splash screen of your wallet.<br />Preferred image size: W: 480px | H: 550px.");
                }

                if (this.value === "scrypt-pos") {
                    // minimum dimensions 220px x 300px
                    image_splash_min_height = 220;
                    image_splash_min_width = 300;
                    $("#ImageSplashHelp").html("Select a PNG image for the splash screen of your wallet.<br />Preferred image size: W: 300px | H: 220px.");
                    // minimum dimensions 220px x 300px
                    image_splash_testnet_min_height = 220;
                    image_splash_testnet_min_width = 300;
                    $("#ImageSplashTestnetHelp").html("Select a PNG image for the testnet splash screen of your wallet.<br />Preferred image size: W: 300px | H: 220px.");
                }

                fv5
                        .enableValidator('ImageSplash', 'notEmpty')
                        .enableValidator('ImageSplash', 'file')
                        .enableValidator('ImageSplash', 'promise');
                fv5
                        .enableValidator('ImageSplashTestnet', 'notEmpty')
                        .enableValidator('ImageSplashTestnet', 'file')
                        .enableValidator('ImageSplashTestnet', 'promise');
                fv5
                        .enableValidator('ImageIcon', 'notEmpty')
                        .enableValidator('ImageIcon', 'file')
                        .enableValidator('ImageIcon', 'promise');
                fv5
                        .enableValidator('ImageIconTestnet', 'notEmpty')
                        .enableValidator('ImageIconTestnet', 'file')
                        .enableValidator('ImageIconTestnet', 'promise');
            }
        }
    });
});
// Coin wizard jquery initial values (Frontpage)
$(".paid-elements").hide();
$(".x11-pow-elements").hide();
$(".quark-pos-elements").hide();
$(".scrypt-pos-elements").hide();
$(".wallet_unit").show();
$(".wallet-splash-images").hide();
$("#wallet_image_icon").attr("alt", "Litecoin wallet icon");
$("#wallet_image_icon").attr("src", "/img/wallet/scrypt-pow/bitcoin.png");
$("#wallet_image_testnet").attr("alt", "Litecoin wallet testnet icon");
$("#wallet_image_testnet").attr("src", "/img/wallet/scrypt-pow/bitcoin_testnet.png");
$('#purchase_type').change(function () {

    if ($(this).val() === "free") {
        $('#Premine100percent').prop('checked', false);
        $("#wallet_maxmoney").prop("disabled", true);
        $("#wallet_blockreward").prop("disabled", false);
        $("#wallet_subsidy").prop("disabled", false);
        $(".paid-elements").hide();
        $(".free-elements").show();
        paidcheck = false;
        if (($('#wallet_type').val() === "scrypt-pos") || ($('#wallet_type').val() === "quark-pos")) {
            $('.wallet_maxmoney_text').text("Coin supply");
            $('.wallet_maxmoney_text_help').text("Estimated amount of coins your coin will produce during the PoW phase.");
        }
        if (($('#wallet_type').val() === "scrypt-pow") || ($('#wallet_type').val() === "sha256-pow") || ($('#wallet_type').val() === "x11-pow")) {
            $('.wallet_maxmoney_text').text("Coin supply");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce.");
        }
    }

    if ($(this).val() === "paid") {
        $("#PremineEnabled").prop("disabled", false);
        $('#Premine100percent').prop('checked', false);
        $(".paid-elements").show();
        $(".free-elements").hide();
        paidcheck = true;
        if (($('#wallet_type').val() === "x11-pow") || ($('#wallet_type').val() === "quark-pos")) {
            $(".premine-100-percent").hide();
        }
        if (($('#wallet_type').val() === "scrypt-pow") || ($('#wallet_type').val() === "sha256-pow") || ($('#wallet_type').val() === "scrypt-pos")) {
            $(".premine-100-percent").show();
        }

        if (($('#wallet_type').val() === "scrypt-pos") || ($('#wallet_type').val() === "quark-pos")) {
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Estimated amount of coins your coin will produce during the PoW phase without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Estimated amount of coins your coin will produce during the PoW phase with premine.");
        }
        if (($('#wallet_type').val() === "scrypt-pow") || ($('#wallet_type').val() === "sha256-pow") || ($('#wallet_type').val() === "x11-pow")) {
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Total amount of coins your coin will produce with premine.");
        }
    }

});
$('#wallet_type').change(function () {

    if ($(this).val() === "quark-pos") {
        $("#wallet_seednodeip0").val("node1.masterstake.net");

        $(".wallet-splash-images").show();
        $("#wallet_image_splash").attr("alt", "Quark wallet splash image");
        $("#wallet_image_splash").attr("src", "/img/wallet/quark-pos/splash.png");
        $("#wallet_image_splash_testnet").attr("alt", "Quark wallet testnet splash image");
        $("#wallet_image_splash_testnet").attr("src", "/img/wallet/quark-pos/splash_testnet.png");
        $("#wallet_image_icon").attr("alt", "Quark wallet icon");
        $("#wallet_image_icon").attr("src", "/img/wallet/quark-pos/bitcoin.png");
        $("#wallet_image_testnet").attr("alt", "Quark wallet testnet icon");
        $("#wallet_image_testnet").attr("src", "/img/wallet/quark-pos/bitcoin_testnet.png");
        $(".scrypt-pos-elements").hide();
        $(".wallet_unit").hide();
        $(".pow-elements").hide();
        $(".quark-pos-elements").show();
        $(".url-elements").hide();
        $("#wallet_blockreward").prop("disabled", false);
        $("#wallet_maxmoney").prop("disabled", true);
        $("#wallet_premineamount").prop("disabled", false);
        if ($('#purchase_type').val() === "free") {
            $('.wallet_maxmoney_text').text("Coin supply");
            $('.wallet_maxmoney_text_help').text("Estimated amount of coins your coin will produce during the PoW phase.");
        }

        if ($('#purchase_type').val() === "paid") {
            $(".premine-100-percent").hide();
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Estimated amount of coins your coin will produce during the PoW phase without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Estimated amount of coins your coin will produce during the PoW phase with premine.");
        }

        $('#wallet_masternode_rewardHelp').text("Percentage of the block reward.");
        var BlockReward = Number($("#wallet_blockreward").val());
        var BlockRewardPoS = Number($("#wallet_blockreward_pos").val());
        var LastPoWBlock = Number($("#wallet_lastpowblock_pos").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        var MasternodeReward = Number($("#wallet_masternode_reward").val());
        WalletMaxMoney = BlockReward * LastPoWBlock;
        TotalWalletMaxMoney = (BlockReward * LastPoWBlock) + PremineAmount;
        $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
        $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        var ShowMasternodeReward = (BlockReward / 100) * MasternodeReward;
        var ShowBlockReward = (BlockReward / 100) * (100 - MasternodeReward);
        var ShowMasternodeRewardPoS = (BlockRewardPoS / 100) * MasternodeReward;
        var ShowBlockRewardPoS = (BlockRewardPoS / 100) * (100 - MasternodeReward);
        var WalletTargetSpacing = Number($("#wallet_targetspacing").val());
        var SuperBlockReward = Number($("#wallet_superblock_reward").val());
        var BudgetCycleBlocks = (1440 / WalletTargetSpacing);
        var Governancebudget = ((BlockRewardPoS / 100) * SuperBlockReward) * BudgetCycleBlocks * 30;
        $("#show_reward_structure").html("<strong>Block reward structure</strong><br />Proof-of-Work phase: Masternode reward: <strong>" + ShowMasternodeReward.toFixed(8) + "</strong>, block reward: <strong>" + ShowBlockReward.toFixed(8) + "</strong><br />Proof-of-Stake phase: Masternode reward: <strong>" + ShowMasternodeRewardPoS.toFixed(8) + "</strong>, block reward: <strong>" + ShowBlockRewardPoS.toFixed(8) + "</strong>");
        $(".show_governance_structure").html("<strong>Governance budget structure</strong><br />Estimated amount of blocks per day: <strong>" + BudgetCycleBlocks + "</strong><br />Governance budget per month: ((<strong>" + BlockRewardPoS.toFixed(8) + "</strong> / 100) * <strong>" + SuperBlockReward + "</strong>) * <strong>" + BudgetCycleBlocks + "</strong> * 30 = <strong>" + Governancebudget.toFixed(8) + "</strong>");
    }
    if ($(this).val() === "scrypt-pos") {
        $("#wallet_seednodeip0").val("node2.masterstake.net");

        $(".wallet-splash-images").show();
        $("#wallet_image_splash").attr("alt", "Bitcoin wallet splash image");
        $("#wallet_image_splash").attr("src", "/img/wallet/splash.png");
        $("#wallet_image_splash_testnet").attr("alt", "Bitcoin wallet testnet splash image");
        $("#wallet_image_splash_testnet").attr("src", "/img/wallet/splash_testnet.png");
        $("#wallet_image_icon").attr("alt", "Bitcoin wallet icon");
        $("#wallet_image_icon").attr("src", "/img/wallet/bitcoin.png");
        $("#wallet_image_testnet").attr("alt", "Bitcoin wallet testnet icon");
        $("#wallet_image_testnet").attr("src", "/img/wallet/bitcoin_testnet.png");
        $(".url-elements").show();
        $(".x11-pow-elements").hide();
        $(".quark-pos-elements").hide();
        $(".wallet_unit").hide();
        $(".pow-elements").hide();
        $(".scrypt-pos-elements").show();
        if ($('#purchase_type').val() === "free") {
            $('.wallet_maxmoney_text').text("Coin supply");
            $('.wallet_maxmoney_text_help').text("Estimated amount of coins your coin will produce during the PoW phase.");
        }

        if ($('#purchase_type').val() === "paid") {
            $(".premine-100-percent").show();
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Estimated amount of coins your coin will produce during the PoW phase without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Estimated amount of coins your coin will produce during the PoW phase with premine.");
        }

        var BlockReward = Number($("#wallet_blockreward").val());
        var LastPoWBlock = Number($("#wallet_lastpowblock_pos").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        WalletMaxMoney = BlockReward * LastPoWBlock;
        TotalWalletMaxMoney = (BlockReward * LastPoWBlock) + PremineAmount;
        $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
        $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
    }
    if ($(this).val() === "scrypt-pow") {
        $("#wallet_seednodeip0").val("node2.masterstake.net");

        $(".wallet-splash-images").hide();
        $("#wallet_image_icon").attr("alt", "Litecoin wallet icon");
        $("#wallet_image_icon").attr("src", "/img/wallet/scrypt-pow/bitcoin.png");
        $("#wallet_image_testnet").attr("alt", "Litecoin wallet testnet icon");
        $("#wallet_image_testnet").attr("src", "/img/wallet/scrypt-pow/bitcoin_testnet.png");
        $(".x11-pow-elements").hide();
        $(".quark-pos-elements").hide();
        $(".scrypt-pos-elements").hide();
        $(".wallet_unit").show();
        $(".pow-elements").show();
        $(".url-elements").show();
        if ($('#purchase_type').val() === "free") {
            $('.wallet_maxmoney_text').text("Coin supply");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce.");
        }

        if ($('#purchase_type').val() === "paid") {
            $(".premine-100-percent").show();
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Total amount of coins your coin will produce with premine.");
        }

        var BlockReward = Number($("#wallet_blockreward").val());
        var Subsidy = Number($("#wallet_subsidy").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        $.getJSON('/include/json/calculate_moneysupply.php?block_reward=' + BlockReward + '&subsidy=' + Subsidy, function (WalletMaxMoney) {

            $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
            var TotalWalletMaxMoney = WalletMaxMoney + PremineAmount;
            $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
            $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        });
    }
    if ($(this).val() === "sha256-pow") {
        $("#wallet_seednodeip0").val("node2.masterstake.net");

        $(".wallet-splash-images").hide();
        $("#wallet_image_icon").attr("alt", "Bitcoin wallet icon");
        $("#wallet_image_icon").attr("src", "/img/wallet/bitcoin.png");
        $("#wallet_image_testnet").attr("alt", "Bitcoin wallet testnet icon");
        $("#wallet_image_testnet").attr("src", "/img/wallet/bitcoin_testnet.png");
        $(".x11-pow-elements").hide();
        $(".quark-pos-elements").hide();
        $(".scrypt-pos-elements").hide();
        $(".wallet_unit").show();
        $(".pow-elements").show();
        $(".url-elements").show();
        if ($('#purchase_type').val() === "free") {
            $('.wallet_maxmoney_text').text("Coin supply");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce.");
        }

        if ($('#purchase_type').val() === "paid") {
            $(".premine-100-percent").show();
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Total amount of coins your coin will produce with premine.");
        }

        var BlockReward = Number($("#wallet_blockreward").val());
        var Subsidy = Number($("#wallet_subsidy").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        $.getJSON('/include/json/calculate_moneysupply.php?block_reward=' + BlockReward + '&subsidy=' + Subsidy, function (WalletMaxMoney) {

            $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
            var TotalWalletMaxMoney = WalletMaxMoney + PremineAmount;
            $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
            $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        });
    }
    if ($(this).val() === "x11-pow") {
        $("#wallet_seednodeip0").val("node1.masterstake.net");

        $(".wallet-splash-images").show();
        $("#wallet_image_splash").attr("alt", "Dash wallet splash image");
        $("#wallet_image_splash").attr("src", "/img/wallet/x11-pow/splash.png");
        $("#wallet_image_splash_testnet").attr("alt", "Dash wallet testnet splash image");
        $("#wallet_image_splash_testnet").attr("src", "/img/wallet/x11-pow/splash_testnet.png");
        $("#wallet_image_icon").attr("alt", "Dash wallet icon");
        $("#wallet_image_icon").attr("src", "/img/wallet/x11-pow/bitcoin.png");
        $("#wallet_image_testnet").attr("alt", "Dash wallet testnet icon");
        $("#wallet_image_testnet").attr("src", "/img/wallet/x11-pow/bitcoin_testnet.png");
        $(".quark-pos-elements").hide();
        $(".scrypt-pos-elements").hide();
        $(".wallet_unit").show();
        $(".pow-elements").show();
        $(".url-elements").show();
        $(".x11-pow-elements").show();
        if ($('#purchase_type').val() === "free") {
            $('.wallet_maxmoney_text').text("Coin supply");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce.");
        }

        if ($('#purchase_type').val() === "paid") {
            $(".premine-100-percent").hide();
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Total amount of coins your coin will produce with premine.");
        }

        $('#wallet_masternode_rewardHelp').text("Percentage of the block reward minus the superblock reward percentage.");
        var BlockReward = Number($("#wallet_blockreward").val());
        var Subsidy = Number($("#wallet_subsidy").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        var SuperBlockReward = Number($("#wallet_superblock_reward").val());
        var MasternodeReward = Number($("#wallet_masternode_reward").val());
        var ShowSuperBlockReward = (BlockReward / 100) * SuperBlockReward;
        var ShowMasternodeReward = ((BlockReward - ShowSuperBlockReward) / 100) * MasternodeReward;
        var ShowBlockReward = ((BlockReward - ShowSuperBlockReward) / 100) * (100 - MasternodeReward);
        $("#show_reward_structure").html("<strong>Block reward structure</strong><br />Superblock reward: <strong>" + ShowSuperBlockReward.toFixed(8) + "</strong>, masternode reward: <strong>" + ShowMasternodeReward.toFixed(8) + "</strong>, block reward: <strong>" + ShowBlockReward.toFixed(8) + "</strong>");
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        $.getJSON('/include/json/calculate_moneysupply.php?block_reward=' + BlockReward + '&subsidy=' + Subsidy, function (WalletMaxMoney) {

            $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
            var TotalWalletMaxMoney = WalletMaxMoney + PremineAmount;
            $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
            $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        });
    }

});
$('#Premine100percent').change(function () {

    if ($('#Premine100percent').is(':checked')) {

        if (($('#wallet_type').val() === "scrypt-pos") || ($('#wallet_type').val() === "quark-pos")) {
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Estimated amount of coins your coin will produce during the PoW phase without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Estimated amount of coins your coin will produce during the PoW phase with premine.");
        }
        if (($('#wallet_type').val() === "scrypt-pow") || ($('#wallet_type').val() === "sha256-pow") || ($('#wallet_type').val() === "x11-pow")) {
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Total amount of coins your coin will produce with premine.");
        }

        $("#PremineEnabled").prop("disabled", true);
        $("#wallet_blockreward").val(0);
        $("#wallet_blockreward_hidden").val(0);
        $("#wallet_blockreward").prop("disabled", true);
        var SubsidyHidden = Number($("#wallet_subsidy").val());
        $("#wallet_subsidy_hidden").val(SubsidyHidden);
        $("#wallet_subsidy").prop("disabled", true);
        $("#wallet_premineamount").prop("disabled", true);
        var WalletMaxMoney = Number($("#wallet_maxmoney").val());
        $("#wallet_premineamount").val(Math.round(WalletMaxMoney));
        $("#wallet_premineamount_hidden").val(Math.round(WalletMaxMoney));
        $("#wallet_maxmoney_total").val(Math.round(WalletMaxMoney));
        $("#wallet_maxmoney_hidden").val(Math.round(WalletMaxMoney));
        $("#wallet_maxmoney").prop("disabled", false);
        $("#wallet_maxmoney").keyup(function () {
            var WalletMaxMoney = Number($("#wallet_maxmoney").val());
            $("#wallet_premineamount").val(Math.round(WalletMaxMoney));
            $("#wallet_premineamount_hidden").val(Math.round(WalletMaxMoney));
            $("#wallet_maxmoney_total").val(Math.round(WalletMaxMoney));
            $("#wallet_maxmoney_hidden").val(Math.round(WalletMaxMoney));
        });
    }

    if ($('#Premine100percent').is(':checked') === false) {

        if (($('#wallet_type').val() === "scrypt-pos") || ($('#wallet_type').val() === "quark-pos")) {
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Estimated amount of coins your coin will produce during the PoW phase without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Estimated amount of coins your coin will produce during the PoW phase with premine.");
        }
        if (($('#wallet_type').val() === "scrypt-pow") || ($('#wallet_type').val() === "sha256-pow") || ($('#wallet_type').val() === "x11-pow")) {
            $('.wallet_maxmoney_text').text("Coin supply without premine");
            $('.wallet_maxmoney_text_help').text("Total amount of coins your coin will produce without premine.");
            $('.wallet_maxmoney_total_text').text("Coin supply with premine");
            $('.wallet_maxmoney_total_text_help').text("Total amount of coins your coin will produce with premine.");
        }

        $("#PremineEnabled").prop("disabled", false);
        $("#wallet_blockreward").val(50);
        $("#wallet_blockreward_hidden").val(50);
        $("#wallet_blockreward").prop("disabled", false);
        $("#wallet_subsidy").prop("disabled", false);
        $("#wallet_premineamount").prop("disabled", false);
        $("#wallet_maxmoney").prop("disabled", true);
        if (($('#wallet_type').val() === "scrypt-pow") || ($('#wallet_type').val() === "sha256-pow") || ($('#wallet_type').val() === "x11-pow")) {
            var BlockReward = Number($("#wallet_blockreward").val());
            var Subsidy = Number($("#wallet_subsidy").val());
            var PremineAmount = Number($("#wallet_premineamount").val());
            $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
            $.getJSON('/include/json/calculate_moneysupply.php?block_reward=' + BlockReward + '&subsidy=' + Subsidy, function (WalletMaxMoney) {

                $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
                var TotalWalletMaxMoney = WalletMaxMoney + PremineAmount;
                $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
                $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
            });
        }

        if (($('#wallet_type').val() === "scrypt-pos") || ($('#wallet_type').val() === "quark-pos")) {
            var BlockReward = Number($("#wallet_blockreward").val());
            var LastPoWBlock = Number($("#wallet_lastpowblock_pos").val());
            var PremineAmount = Number($("#wallet_premineamount").val());
            WalletMaxMoney = BlockReward * LastPoWBlock;
            TotalWalletMaxMoney = (BlockReward * LastPoWBlock) + PremineAmount;
            $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
            $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
            $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
            $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        }
    }

});
$('#PremineEnabled').change(function () {

    $("#wallet_premineamount").val(0);
    $("#wallet_premineamount_hidden").val(0);
    if ($(this).val() === "false") {
        $("#wallet_premineamount").prop("disabled", true);
        $("#Premine100percent").prop("disabled", true);
    }

    if ($(this).val() === "true") {
        $("#wallet_premineamount").prop("disabled", false);
        $("#Premine100percent").prop("disabled", false);
    }

    if (($('#wallet_type').val() === "scrypt-pow") || ($('#wallet_type').val() === "sha256-pow") || ($('#wallet_type').val() === "x11-pow")) {
        var BlockReward = Number($("#wallet_blockreward").val());
        var Subsidy = Number($("#wallet_subsidy").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        $.getJSON('/include/json/calculate_moneysupply.php?block_reward=' + BlockReward + '&subsidy=' + Subsidy, function (WalletMaxMoney) {

            var TotalWalletMaxMoney = WalletMaxMoney - PremineAmount;
            $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
            $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        });
    }
    if (($('#wallet_type').val() === "scrypt-pos") || ($('#wallet_type').val() === "quark-pos")) {
        var BlockReward = Number($("#wallet_blockreward").val());
        var LastPoWBlock = Number($("#wallet_lastpowblock_pos").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        WalletMaxMoney = BlockReward * LastPoWBlock;
        TotalWalletMaxMoney = (BlockReward * LastPoWBlock) + PremineAmount;
        $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
        $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
    }
});
$("#wallet_blockreward, #wallet_subsidy, #wallet_premineamount").keyup(function () {
    if (($('#wallet_type').val() === "scrypt-pow") || ($('#wallet_type').val() === "sha256-pow")) {

        var BlockReward = Number($("#wallet_blockreward").val());
        var Subsidy = Number($("#wallet_subsidy").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        $.getJSON('/include/json/calculate_moneysupply.php?block_reward=' + BlockReward + '&subsidy=' + Subsidy, function (WalletMaxMoney) {

            $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
            var TotalWalletMaxMoney = WalletMaxMoney + PremineAmount;
            $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
            $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        });
    }
});
$("#wallet_blockreward, #wallet_subsidy, #wallet_premineamount, #wallet_superblock_reward, #wallet_masternode_reward").keyup(function () {
    if ($('#wallet_type').val() === "x11-pow") {

        var BlockReward = Number($("#wallet_blockreward").val());
        var Subsidy = Number($("#wallet_subsidy").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        var SuperBlockReward = Number($("#wallet_superblock_reward").val());
        var MasternodeReward = Number($("#wallet_masternode_reward").val());
        var ShowSuperBlockReward = (BlockReward / 100) * SuperBlockReward;
        var ShowMasternodeReward = ((BlockReward - ShowSuperBlockReward) / 100) * MasternodeReward;
        var ShowBlockReward = ((BlockReward - ShowSuperBlockReward) / 100) * (100 - MasternodeReward);
        $("#show_reward_structure").html("<strong>Block reward structure</strong><br />Superblock reward: <strong>" + ShowSuperBlockReward.toFixed(8) + "</strong>, masternode reward: <strong>" + ShowMasternodeReward.toFixed(8) + "</strong>, block reward: <strong>" + ShowBlockReward.toFixed(8) + "</strong>");
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        $.getJSON('/include/json/calculate_moneysupply.php?block_reward=' + BlockReward + '&subsidy=' + Subsidy, function (WalletMaxMoney) {

            $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
            var TotalWalletMaxMoney = WalletMaxMoney + PremineAmount;
            $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
            $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        });
    }
});
$("#wallet_blockreward, #wallet_premineamount, #wallet_lastpowblock_pos").keyup(function () {
    if ($('#wallet_type').val() === "scrypt-pos") {
        var BlockReward = Number($("#wallet_blockreward").val());
        var LastPoWBlock = Number($("#wallet_lastpowblock_pos").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        WalletMaxMoney = BlockReward * LastPoWBlock;
        TotalWalletMaxMoney = (BlockReward * LastPoWBlock) + PremineAmount;
        $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
        $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
    }
});
$("#wallet_blockreward, #wallet_blockreward_pos, #wallet_premineamount, #wallet_superblock_reward, #wallet_lastpowblock_pos, #wallet_masternode_reward, #wallet_targetspacing").keyup(function () {
    if ($('#wallet_type').val() === "quark-pos") {
        var BlockReward = Number($("#wallet_blockreward").val());
        var BlockRewardPoS = Number($("#wallet_blockreward_pos").val());
        var LastPoWBlock = Number($("#wallet_lastpowblock_pos").val());
        var PremineAmount = Number($("#wallet_premineamount").val());
        var MasternodeReward = Number($("#wallet_masternode_reward").val());
        WalletMaxMoney = BlockReward * LastPoWBlock;
        TotalWalletMaxMoney = (BlockReward * LastPoWBlock) + PremineAmount;
        $("#wallet_maxmoney").val(Math.round(WalletMaxMoney));
        $("#wallet_maxmoney_total").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_maxmoney_hidden").val(Math.round(TotalWalletMaxMoney));
        $("#wallet_premineamount_hidden").val(Math.round(PremineAmount));
        var ShowMasternodeReward = (BlockReward / 100) * MasternodeReward;
        var ShowBlockReward = (BlockReward / 100) * (100 - MasternodeReward);
        var ShowMasternodeRewardPoS = (BlockRewardPoS / 100) * MasternodeReward;
        var ShowBlockRewardPoS = (BlockRewardPoS / 100) * (100 - MasternodeReward);
        var WalletTargetSpacing = Number($("#wallet_targetspacing").val());
        var SuperBlockReward = Number($("#wallet_superblock_reward").val());
        var BudgetCycleBlocks = (1440 / WalletTargetSpacing);
        var Governancebudget = ((BlockRewardPoS / 100) * SuperBlockReward) * BudgetCycleBlocks * 30;
        $("#show_reward_structure").html("<strong>Block reward structure</strong><br />Proof-of-Work phase: Masternode reward: <strong>" + ShowMasternodeReward.toFixed(8) + "</strong>, block reward: <strong>" + ShowBlockReward.toFixed(8) + "</strong><br />Proof-of-Stake phase: Masternode reward: <strong>" + ShowMasternodeRewardPoS.toFixed(8) + "</strong>, block reward: <strong>" + ShowBlockRewardPoS.toFixed(8) + "</strong>");
        $(".show_governance_structure").html("<strong>Governance budget structure</strong><br />Estimated amount of blocks per day: <strong>" + BudgetCycleBlocks + "</strong><br />Governance budget per month: ((<strong>" + BlockRewardPoS.toFixed(8) + "</strong> / 100) * <strong>" + SuperBlockReward + "</strong>) * <strong>" + BudgetCycleBlocks + "</strong> * 30 = <strong>" + Governancebudget.toFixed(8) + "</strong>");
    }
});
$("#wallet_maturity").keyup(function () {
    WalletMaturity = Number($("#wallet_maturity").val());
    TotalWalletMaturity = WalletMaturity + 1;
    $("#show_maturity_structure").html("<strong>Coinbase maturity structure</strong><br />Maturity confirmations: <strong>" + WalletMaturity + "</strong>, wallet confirmations: <strong>1</strong>, total maturity confirmations: <strong>" + TotalWalletMaturity + "</strong>");
});
$('#HardSeed').change(function () {
    if ($('#HardSeed').is(':checked')) {
        $(".node-elements").show();
    } else {
        $(".node-elements").hide();
    }
});