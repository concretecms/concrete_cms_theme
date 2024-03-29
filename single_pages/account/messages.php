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
use PortlandLabs\ConcreteCmsTheme\Navigation\UrlManager;

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

if (!isset($receiverId)) {
    $receiverId = null;
}

if (!isset($msgID)) {
    $msgID = null;
}

$app = Application::getFacadeApplication();
/** @var Date $dh */
$dh = $app->make(Date::class);
/** @var UserInterface $userInterface */
$userInterface = $app->make(UserInterface::class);
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Token $token */
$token = $app->make(Token::class);

$marketingUrl = app(UrlManager::class)->getMarketingUrl();

$pagination = null;
if ($messageList) {
    $pagination = new \Pagerfanta\Pagerfanta(new Pagerfanta\Adapter\ArrayAdapter($messageList->get()));
    $currentPage = max(1, min($pagination->getNbPages(), (int) $currentPage));
    $pagination->setCurrentPage($currentPage);
}
?>

<div class="messages">
    <?php echo $form->hidden("box", $mailbox->msgMailboxID); ?>

    <div class="container">
        <div class="row">
            <div class="col">
                <?php
                $a = new \Concrete\Core\Area\Area('Header');
                $a->display($c);
                ?>
            </div>
        </div>


        <div class="row">
            <div class="col-md col-sm-12">

                <div class="d-flex align-items-center float-md-end" data-vue-app="send-message">
                    <a href="<?=$marketingUrl?>/about/contact-us/information-request" class="float-end me-3 btn btn-secondary btn-sm">
                        <?=t('Report Inappropriate Content')?>
                    </a>
                    <compose-private-message
                            send-message-token="<?=$token->generate("validate_send_message")?>"
                            :user-select-options='{labelFormat:"username", includeAvatar: true, accessToken:"<?=$userSelectAccessToken?>"}'
                            css-class="float-end btn btn-primary"
                    ></compose-private-message>
                </div>


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

        </div>

        <div class="clearfix"></div>

        <div class="row">
            <div class="col">
                <?php if (!$pagination->getNbResults()) { ?>
                    <div class="alert alert-warning">
                        <?php echo t("This folder is empty."); ?>
                    </div>
                <?php } else { ?>
                    <table class="table message-table">
                        <thead>
                        <tr>
                            <th class="checkbox-wrapper"><div class="dropdown">
                                <div class="btn-group">
                                    <span class="btn btn-sm btn-secondary">
                                        <input type="checkbox" name="msgAll" id="ccm-select-all-messages"/>
                                    </span>
                                    <button type="button" data-bs-reference="parent" data-bs-toggle="dropdown" class="dropdown-toggle dropdown-toggle-split text-black btn btn-sm btn-secondary">
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <ul class="dropdown-menu" id="ccm-message-bulk-menu" aria-labelledby="ccm-message-bulk-action">
                                        <a class="dropdown-item" href="javascript:void(0);"
                                           id="ccm-messages-bulk-action-select-all">
                                            <?php echo t("Select All"); ?>
                                        </a>

                                        <a class="dropdown-item d-none" href="javascript:void(0);"
                                           id="ccm-messages-bulk-action-unselect-all">
                                            <?php echo t("Unselect All"); ?>
                                        </a>

                                        <a class="dropdown-item bulk-action-item disabled" href="javascript:void(0);"
                                           data-action="read"
                                           data-token="<?= $token->generate('mark_read') ?>">
                                            <?php echo t("Mark as read"); ?>
                                        </a>

                                        <a class="dropdown-item bulk-action-item disabled" href="javascript:void(0);"
                                           data-action="unread"
                                           data-token="<?= $token->generate('mark_unread') ?>">
                                            <?php echo t("Mark as unread"); ?>
                                        </a>

                                        <div class="dropdown-divider"></div>

                                        <a class="dropdown-item bulk-action-item disabled" href="javascript:void(0);"
                                           data-action="delete"
                                           data-token="<?= $token->generate('delete_messages') ?>">
                                            <?php echo t("Delete"); ?>
                                        </a>
                                    </ul>
                                </div>
                            </th>

                            <th class="w-25">
                                <?php if (Mailbox::MBTYPE_SENT == $mailbox->getMailboxID()) { ?>
                                    <?php echo t('To'); ?>
                                <?php } else { ?>
                                    <?php echo t('From'); ?>
                                <?php } ?>
                            </th>

                            <th class="w-25">
                                <?php echo t('Subject'); ?>
                            </th>

                            <th class="w-25">
                                <?php echo t('Sent At'); ?>
                            </th>
                            <?php if ($mailbox->getMailboxID() === Mailbox::MBTYPE_INBOX) { ?>
                                <th class="text-center">
                                    <?php echo t('Replied'); ?>
                                </th>
                            <?php } ?>
                        </tr>
                        </thead>

                        <tbody>
                        <?php if ($pagination) { ?>
                            <?php foreach ($pagination->getCurrentPageResults() as $msg) { ?>
                                <tr class="<?php echo $msg->isMessageUnread() ? "unread" : ""; ?>"
                                    data-message-id="<?php echo h($msg->getMessageID()); ?>">
                                    <td class="checkbox-wrapper">
                                        <div>
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
                                        <a href="<?php echo (string)Url::to("/members/profile", $msg->getMessageRelevantUserID()); ?>">
                                            <?php echo $msg->getMessageRelevantUserName(); ?>
                                        </a>
                                    </td>

                                    <td class="ccm-profile-messages-item-name">
                                        <a href="<?php echo (string)Url::to("/account/messages/details", $mailbox->getMailboxID(), $msg->getMessageID()); ?>">
                                            <?php echo $msg->getFormattedMessageSubject(); ?>
                                        </a>
                                    </td>

                                    <td>
                                        <?php /** @noinspection PhpUnhandledExceptionInspection */
                                        echo $dh->formatDateTime($msg->getMessageDateAdded(), true); ?>
                                    </td>
                                    <?php if ($mailbox->getMailboxID() === Mailbox::MBTYPE_INBOX) { ?>
                                        <td class="text-center">
                                        <?php
                                            if ($msg->isMessageReplied()) { ?>
                                               <i class="fas fa-check"></i>
                                        <?php }
                                        ?>
                                        </td>
                                    <?php } ?>
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

                    <div class="d-flex justify-content-center">
                        <div>
                            <?php
                            $template = new \Concrete\Core\Search\Pagination\View\ConcreteBootstrap4View();
                            $baseUrl = \League\Url\Url::createFromServer($_SERVER);
                            echo $template->render($pagination, function($page) use ($messageList, $baseUrl) {
                                $baseUrl->getQuery()->modify(['p' => $page]);
                                return (string) $baseUrl;
                            });
                            ?>
                        </div>
                    </div>
                    <?php
                }
                ?>
            </div>
        </div>
    </div>
</div>

<script>
    $(function () {
        Concrete.Vue.activateContext('frontend', function (Vue, config) {
            new Vue({
                el: 'div[data-vue-app=send-message]',
                components: config.components
            });
        });
    });
</script>
