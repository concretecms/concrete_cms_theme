<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Entity\File\Version;
use Concrete\Core\Localization\Service\Date;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\PrivateMessage\PrivateMessage as UserPrivateMessage;
use Concrete\Core\User\PrivateMessage\Mailbox as UserPrivateMessageMailbox;
use Concrete\Core\User\UserInfo;

/** @var UserPrivateMessage $msg */
/** @var UserPrivateMessageMailbox $mailbox */
/** @var string $deleteUrl */

/** @var UserInfo $userInfo */
$userInfo = $msg->getMessageRelevantUserObject();

$app = Application::getFacadeApplication();
/** @var Date $dateHelper */
$dateHelper = $app->make(Date::class);
?>

<div class="messages">
    <div class="container">
        <div class="row">
            <div class="col">
                <a href="<?php echo h((string)Url::to("/account/messages")); ?>"
                   class="btn btn-secondary">
                    <?php if ($mailbox->getMailboxID() === UserPrivateMessageMailbox::MBTYPE_INBOX) { ?>
                        <?php echo t("Back to Inbox"); ?>
                    <?php } else if ($mailbox->getMailboxID() === UserPrivateMessageMailbox::MBTYPE_INBOX) { ?>
                        <?php echo t("Back to Sent"); ?>
                    <?php } else { ?>
                        <?php echo t("Back to Messages"); ?>
                    <?php } ?>
                </a>
            </div>
        </div>

        <div class="message-details">
            <div class="row">
                <div class="col-md col-sm-12">
                    <h2 class="message-subject">
                        <?php echo h($msg->getMessageSubject()); ?>
                    </h2>
                </div>

                <div class="col-md col-sm-12">
                    <div class="message-date">
                        <div class="float-md-end float-lg-end float-xl-end float-sm-start float-xs-start">
                            <div class="text-muted">
                                <?php /** @noinspection PhpUnhandledExceptionInspection */
                                echo $dateHelper->formatDateTime($msg->getMessageDateAdded()); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr/>

            <div class="row">
                <div class="col">
                    <div class="message-user-info">
                        <?php
                        if ($userInfo) { ?>
                            <a href="<?php echo h((string)Url::to("/members/profile", $userInfo->getUserID())); ?>"
                               class="message-user-avatar">
                                <?php echo $userInfo->getUserAvatar()->output(); ?>
                            </a>

                            <a href="<?php echo h((string)Url::to("/members/profile", $userInfo->getUserID())); ?>"
                               class="message-user-name">
                                <?php echo $userInfo->getUserName(); ?>
                            </a>
                        <?php
                        } else {
                            echo t('Deleted User');
                        }
                        ?>
                    </div>
                </div>

            </div>

            <div class="row">
                <div class="col">
                    <pre class="message-body" style="font-family:'Noto Sans', 'sans-serif';white-space:pre-wrap;"><?php
                        // Don't put a newline between the pre tags and the php opening/closing tags or it will add
                        // spaces
                        echo h($msg->getMessageBody());
                    ?></pre>

                    <?php if (count($msg->getAttachments()) > 0) { ?>
                        <div class="message-attachments">
                            <strong>
                                <?php echo t("Attachments"); ?>
                            </strong>

                            <ul class="message-attachment-list">
                                <?php foreach ($msg->getAttachments() as $attachment) { ?>
                                    <?php $attachmentFileVersion = $attachment->getApprovedVersion(); ?>
                                    <?php if ($attachmentFileVersion instanceof Version) { ?>
                                        <li class="message-attachment-list-item">
                                            <a href="<?php echo h($attachmentFileVersion->getURL()); ?>" target="_blank"
                                               title="<?php echo h($attachmentFileVersion->getFileName()); ?>">
                                                <?php echo $attachmentFileVersion->getFileName(); ?>
                                            </a>
                                        </li>
                                    <?php } ?>
                                <?php } ?>
                            </ul>
                        </div>
                    <?php } ?>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="message-actions">
                        <div class="float-end" data-vue-app="send-message">
                            <a href="<?php echo h($deleteUrl) ?>" class="btn btn-danger message-action">
                                <?php echo t("Delete"); ?>
                            </a>

                            <?php
                            if (isset($sender) && ($sender->getAttribute('profile_private_messages_enabled') || $sender->getUserID() == $profile->getUserID())) {

                            ?>


                            <compose-private-message
                                    send-message-token="<?=$token->generate("validate_send_message")?>"
                                    :user-select-options='{labelFormat:"username", includeAvatar: true, accessToken:"<?=$userSelectAccessToken?>"}'
                                    css-class="btn btn-primary"
                                    <?php if ($sender->getUserID() == $profile->getUserID()) {
                                        // Fix for CS-334: if the user is viewing their own sent message and hits reply to it
                                        // they should not reply to the message specifically (which would literally be sending a message to
                                        // themselves), instead they should craft a new message to the recient of the original message.
                                        ?>
                                        :send-message-to-user-id="<?=$msg->getMessageUserToID()?>"
                                        message-subject=<?=json_encode(t('Re: %s', h($msg->getMessageSubject())))?>
                                    <?php } else { ?>
                                        reply-to-message-id="<?php echo $msg->getMessageID(); ?>"
                                    <?php } ?>
                                    button-text="<?=t('Reply')?>"
                                    dialog-title="<?=t('Reply')?>"
                                <?php if (isset($openComposeWindow) && $openComposeWindow == true) {
                                    // We get here when following a direct "reply-to" link from a PM
                                    ?>
                                    :open-compose-window="true"
                                <?php } ?>
                            ></compose-private-message>

                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(function () {
        Concrete.Vue.activateContext('frontend', function (Vue, config) {
            $('div[data-vue-app=send-message]').each(function() {
                new Vue({
                    el: $(this).get(0),
                    components: config.components
                });
            })
        });
    });


</script>
