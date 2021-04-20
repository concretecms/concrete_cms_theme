<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Application\Service\UserInterface;
use Concrete\Core\Form\Service\Form;
use Concrete\Core\Localization\Service\Date;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\PrivateMessage\Mailbox;
use Concrete\Core\User\PrivateMessage\PrivateMessage;
use Concrete\Core\User\PrivateMessage\PrivateMessageList;
use Concrete\Core\User\UserInfo;
use Concrete\Core\Validation\CSRF\Token;
use Concrete\Core\View\View;

/** @var int $msgID */
/** @var UserInfo $recipient */
/** @var View $view */
/** @var Mailbox $mailbox * */
/** @var string $box * */
/** @var Mailbox $inbox * */
/** @var Mailbox $sent * */
/** @var PrivateMessage $msg * */
/** @var PrivateMessageList $messageList * */
/** @var PrivateMessage[] $messages * */
/** @var string $backURL */
/** @var string $deleteURL */
/** @var string $dateAdded */
/** @var null|int $receiverId */

$app = Application::getFacadeApplication();
/** @var Date $dh */
$dh = $app->make(Date::class);
/** @var UserInterface $userInterface */
$userInterface = $app->make(UserInterface::class);
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Token $token */
$token = $app->make(Token::class);

?>

<div class="messages">
    <?php echo $form->hidden("box", $mailbox->msgMailboxID); ?>

    <div class="container">
        <div class="row">
            <div class="col">
                <h1>
                    <?php echo t("Messages"); ?>
                </h1>

                <p>
                    <?php echo t("Each level of certification build on the one before."); ?>
                </p>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link <?php echo $mailbox->getMailboxID() == $inbox->getMailboxID() ? "active" : ""; ?>"
                           href="<?php echo (string)Url::to("/account/messages", $inbox->getMailboxID()); ?>">
                            <?php echo t("Inbox"); ?>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link <?php echo $mailbox->getMailboxID() == $sent->getMailboxID() ? "active" : ""; ?>"
                           href="<?php echo (string)Url::to("/account/messages", $sent->getMailboxID()); ?>">
                            <?php echo t("Sent"); ?>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="col">
                <div class="float-right">
                    <a href="javascript:void(0);" class="btn btn-primary send-message">
                        <?php echo t("Send Message"); ?>
                    </a>
                </div>
            </div>
        </div>

        <div class="clearfix"></div>

        <div class="row">
            <div class="col">
                <?php if (count($messages) === 0) { ?>
                    <div class="alert alert-warning">
                        <?php echo t("This folder is empty."); ?>
                    </div>
                <?php } else { ?>
                    <table class="table message-table">
                        <thead>
                        <tr>
                            <th>
                                <div class="dropdown ccm-dropdown">
                                    <button class="dropdown-toggle checkbox-wrapper" type="button"
                                            id="ccm-message-bulk-action"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <input type="checkbox" name="msgAll" id="ccm-select-all-messages"/> &nbsp;
                                        <label for="ccm-select-all-messages">
                                            &nbsp;
                                        </label>
                                    </button>

                                    <div class="dropdown-menu" aria-labelledby="ccm-message-bulk-action">
                                        <a class="dropdown-item" href="javascript:void(0);"
                                           id="ccm-messages-bulk-action-select-all">
                                            <?php echo t("Select All"); ?>
                                        </a>

                                        <a class="dropdown-item d-none" href="javascript:void(0);"
                                           id="ccm-messages-bulk-action-unselect-all">
                                            <?php echo t("Unselect All"); ?>
                                        </a>

                                        <a class="dropdown-item bulk-action-item disabled" href="javascript:void(0);"
                                           data-action="read">
                                            <?php echo t("Mark as read"); ?>
                                        </a>

                                        <a class="dropdown-item bulk-action-item disabled" href="javascript:void(0);"
                                           data-action="unread">
                                            <?php echo t("Mark as unread"); ?>
                                        </a>

                                        <div class="dropdown-divider"></div>

                                        <a class="dropdown-item bulk-action-item disabled" href="javascript:void(0);"
                                           data-action="delete">
                                            <?php echo t("Delete"); ?>
                                        </a>
                                    </div>
                                </div>
                            </th>

                            <th>
                                <?php if (Mailbox::MBTYPE_SENT == $mailbox->getMailboxID()) { ?>
                                    <?php echo t('To'); ?>
                                <?php } else { ?>
                                    <?php echo t('From'); ?>
                                <?php } ?>
                            </th>

                            <th>
                                <?php echo t('Subject'); ?>
                            </th>

                            <th class="text-right">
                                <?php echo t('Sent At'); ?>
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        <?php if (is_array($messages)) { ?>
                            <?php foreach ($messages as $msg) { ?>
                                <?php $profileURL = $msg->getMessageRelevantUserObject()->getUserPublicProfileURL(); ?>
                                <tr class="<?php echo $msg->isMessageUnread() ? "unread" : ""; ?>"
                                    data-message-id="<?php echo h($msg->getMessageID()); ?>">
                                    <td>
                                        <div class="checkbox-wrapper">
                                            <input type="checkbox"
                                                   name="msg[]"
                                                   value="<?php echo (int)$msg->getMessageID(); ?>"
                                                   class="ccm-message-item"
                                                   id="ccm-select-message-<?php echo (int)$msgID; ?>"/>
                                            <label for="ccm-select-message-<?php echo (int)$msgID; ?>">
                                                &nbsp;
                                            </label>
                                        </div>
                                    </td>
                                    <td class="ccm-profile-message-from">
                                        <?php if ($profileURL) { ?>
                                            <a href="<?php echo $profileURL; ?>">
                                                <?php echo $msg->getMessageRelevantUserName(); ?>
                                            </a>
                                        <?php } else { ?>
                                            <div>
                                                <?php echo $msg->getMessageRelevantUserName(); ?>
                                            </div>
                                        <?php } ?>
                                    </td>

                                    <td class="ccm-profile-messages-item-name">
                                        <a href="javascript:void(0);" class="send-message"
                                           data-message-id="<?php echo $msg->getMessageID(); ?>">
                                            <?php echo $msg->getFormattedMessageSubject(); ?>
                                        </a>
                                    </td>

                                    <td class="text-right">
                                        <?php /** @noinspection PhpUnhandledExceptionInspection */
                                        echo $dh->formatDateTime($msg->getMessageDateAdded(), true); ?>
                                    </td>
                                </tr>
                            <?php } ?>
                        <?php } else { ?>
                            <tr>
                                <td colspan="4">
                                    <?php echo t('No messages found.'); ?>
                                </td>
                            </tr>
                        <?php } ?>
                        </tbody>
                    </table>

                    <?php
                    $summary = $messageList->getSummary();
                    $paginator = $messageList->getPagination(false, []);
                    $paginator->classOff = "page-link";
                    $paginator->classOn = "page-link";
                    $paginator->classCurrent = "page-link";
                    ?>
                    <?php if ($summary->pages > 1) { ?>
                        <ul class="pagination justify-content-center">
                        <?php echo $paginator->getPages("li"); ?>
                    <?php } ?>
                    </ul>
                <?php } ?>
            </div>
        </div>
    </div>

    <?php if ($receiverId > 0) { ?>
        <!--suppress JSUnresolvedFunction -->
        <script>
            (function ($) {
                $(function () {
                    window.sendPrivatePrivate(<?php /** @noinspection PhpComposerExtensionStubsInspection */echo json_encode([
                        "receiver" => $receiverId
                    ]); ?>);
                });
            })(jQuery);
        </script>
    <?php } ?>
</div>