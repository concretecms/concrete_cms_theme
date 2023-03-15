<template>
    <span>
        <a href="#" :class="cssClass" @click.prevent="showMessageModal">{{ this.buttonText }}</a>

        <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" tabindex="-1"
             ref="composeModal" id="modal-compose-message">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">{{this.dialogTitle}}</h4>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3 row">
                                <label class="col-sm-3 col-form-label">
                                    {{ i18n.receiverLabel }}
                                </label>

                                <div class="col-sm">
                                    <concrete-user-select
                                        :access-token="userSelectOptions.accessToken"
                                        :include-avatar="userSelectOptions.includeAvatar"
                                        :label-format="userSelectOptions.labelFormat"
                                        v-model="receiver"
                                    ></concrete-user-select>
                                </div>
                            </div>

                            <div class="mb-3 row">
                                <label for="msgSubject" class="col-sm-3 col-form-label">
                                    {{ i18n.subjectLabel }}
                                </label>

                                <div class="col-sm">
                                    <input id="msgSubject" name="msgSubject" type="text" class="form-control" v-model="subject" />
                                </div>
                            </div>

                            <div class="mb-3 row">
                                <label for="msgBody" class="col-sm-3 col-form-label">
                                    {{i18n.messageLabel}}
                                </label>

                                <div class="col-sm">
                                    <textarea id="msgBody" name="msgBody" rows="8" class="form-control" v-model="body"></textarea>
                                </div>
                            </div>

                            <div class="mb-3 row">
                                <label for="msgAttachments" class="col-sm-3 col-form-label">
                                    {{i18n.attachmentsLabel}}
                                </label>

                                <div class="col-sm">

                                    <div class="upload-item">
                                        <div class="upload-btn-wrapper" v-if="attachment == null">
                                            <button class="btn btn-sm btn-secondary">
                                                {{i18n.uploadFilesButton}}
                                            </button>

                                            <input id="msgAttachments" name="msgAttachments[]" ref="msgAttachments" type="file"
                                                   class="form-control attachments" multiple="multiple" @change="selectFile" />
                                        </div>

                                        <div class="files-container" v-if="attachment != null">
                                            <div class="file-details">
                                                <a href="#" class="selected-file">{{attachment.name}}</a>
                                                <a href="#" class="remove-selected-file" @click="attachment = null"><i class="fas fa-trash"></i></a>
                                            </div>
                                        </div>

                                        <div class="upload-notice">
                                            {{i18n.uploadFilesNotice}}
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </form>

                    </div>
                    <div class="modal-footer d-flex justify-content-between w-100">
                        <button type="button" data-bs-dismiss="modal" class="btn btn-secondary border float-start">
                            {{i18n.cancelButton}}
                        </button>
                        <button class="btn btn-primary" name="action" type="button" @click="sendMessage">
                            {{i18n.sendButton}}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </span>
</template>

<script>
import {alert, Stack, defaultModules} from '@pnotify/core';
import * as PNotifyBootstrap4 from '@pnotify/bootstrap4';
defaultModules.set(PNotifyBootstrap4, {});
const stackBottomModal = new Stack({
    dir1: 'up',
    dir2: 'left',
    firstpos1: 25,
    firstpos2: 25,
    push: 'top',
    maxOpen: 5,
    modal: false,
    overlayClose: false,
    context: $('body').get(0)
});


import ConcreteUserSelect from '@concretecms/bedrock/assets/cms/components/form/ConcreteUserSelect'
/* eslint-disable no-new, no-unused-vars, camelcase, eqeqeq */
/* globals TomSelect, ccmi18n_community */
export default {
    components: {
        ConcreteUserSelect
    },
    data() {
        return {
            i18n: ccmi18n_community,
            attachment: null,
            subject: null,
            body: null,
            receiver: null,
            receiverUsername: null, // only used in reply mode
        }
    },
    props: {
        replyToMessageId: {
            required: false
        },
        sendMessageToUserId: {
            required: false
        },
        buttonText: {
            type: String,
            required: false,
            default: ccmi18n_community.dialogTitle
        },
        dialogTitle: {
            type: String,
            required: false,
            default: ccmi18n_community.dialogTitle
        },
        cssClass: {
            type: String,
            required: false
        },
        sendMessageToken: {
            type: String,
            required: true
        },
        userSelectOptions: {
            type: Object,
            required: true
        }
    },
    mounted() {
        if (this.sendMessageToUserId) {
            this.receiver = this.sendMessageToUserId
        }

        this.modal = bootstrap.Modal.getOrCreateInstance(this.$refs.composeModal)
    },
    computed: {},
    methods: {
        selectFile() {
            this.attachment = this.$refs.msgAttachments.files[0]
        },
        showMessageModal() {
            var my = this
            if (this.replyToMessageId) {
                $.ajax({
                    url: CCM_DISPATCHER_FILENAME + "/api/v1/messages/compose",
                    method: "GET",
                    data: {
                        msgID: my.replyToMessageId,
                    },
                    success: function(data) {
                        my.subject = data.messageData.msgSubject
                        my.receiver = data.messageData.uID
                        my.receiverUsername = data.messageData.uName
                        my.modal.show()
                    }
                })
            } else {
                my.modal.show()
            }
        },
        sendMessage() {
            var my = this
            var formData = new FormData()
            if (my.receiver) {
                formData.append('uID', my.receiver)
            }
            if (my.subject) {
                formData.append('msgSubject', my.subject)
            }
            if (my.body) {
                formData.append('msgBody', my.body)
            }
            formData.append('ccm_token', my.sendMessageToken)
            if (this.replyToMessageId) {
                formData.append('msgID', my.replyToMessageId)
            }
            if (my.attachment) {
                formData.append('msgAttachments[]', my.attachment, my.attachment.name)
            }

            $.ajax({
                url: CCM_DISPATCHER_FILENAME + "/api/v1/messages/send",
                method: "POST",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                error: (r) => {
                    alert({
                        text: my.i18n.generalError,
                        stack: stackBottomModal,
                        type: 'error'
                    });
                },
                success: (data) => {
                    if (data.error) {
                        for (let i = 0; i < data.errors.length; i++) {
                            let errorMessage = data.errors[i];

                            alert({
                                text: errorMessage,
                                stack: stackBottomModal,
                                type: 'error'
                            });
                        }
                    } else {
                        alert({
                            text: data.message,
                            stack: stackBottomModal,
                            type: 'success'
                        });

                        setTimeout(function () {
                            window.location.href = CCM_DISPATCHER_FILENAME + "/account/messages";
                        }, 3000);


                        this.modal.hide()
                   }
                }
            });
        }
    }
}
</script>
