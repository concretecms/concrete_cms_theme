<?php
/** @noinspection PhpInconsistentReturnPointsInspection */

/** @noinspection PhpUnused */
/** @noinspection DuplicatedCode */

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Account;

use Concrete\Core\Error\UserMessageException;
use Concrete\Core\Http\Response;
use Concrete\Core\Http\ResponseFactory;
use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\Component\UserSelectInstanceFactory;
use Concrete\Core\User\PrivateMessage\Mailbox;
use Concrete\Core\User\PrivateMessage\Mailbox as UserPrivateMessageMailbox;
use Concrete\Core\User\PrivateMessage\PrivateMessage as UserPrivateMessage;
use Concrete\Core\User\User;
use Concrete\Core\User\UserInfoRepository;
use Concrete\Core\Validation\CSRF\Token;
use PortlandLabs\ConcreteCmsTheme\Page\Controller\AccountPageController;

class Messages extends AccountPageController
{
    public function write($receiverId = null)
    {
        $this->view();
        $this->set('receiverId', $receiverId);
    }

    public function delete($mailboxId = null, $messageId = null, $token = null)
    {
        /** @var ResponseFactory $responseFactory */
        $responseFactory = $this->app->make(ResponseFactory::class);

        /** @var Token $valt */
        $valt = $this->app->make(Token::class);
        if (!$valt->validate('message_delete_' . $messageId, $token)) {
            throw new UserMessageException($valt->getErrorMessage());
        }

        /** @var User $u */
        $u = $this->app->make(User::class);
        /** @var UserInfoRepository $userInfoRepository */
        $userInfoRepository = $this->app->make(UserInfoRepository::class);
        $ui = $userInfoRepository->getByID($u->getUserID());

        $mailbox = UserPrivateMessageMailbox::get($ui, $mailboxId);
        $msg = UserPrivateMessage::getByID($messageId, $mailbox);

        if ($msg instanceof UserPrivateMessage) {
            if ($ui->canReadPrivateMessage($msg)) {
                $msg->delete();

                return $responseFactory->redirect(
                    (string)Url::to("/account/messages"),
                    Response::HTTP_TEMPORARY_REDIRECT
                );
            } else {
                return $responseFactory->forbidden(Page::getCurrentPage());
            }
        } else {
            return $responseFactory->notFound(t("Not Found"));
        }
    }

    public function details($mailboxId = null, $messageId = null)
    {
        /** @var ResponseFactory $responseFactory */
        $responseFactory = $this->app->make(ResponseFactory::class);
        /** @var User $u */
        $u = $this->app->make(User::class);
        /** @var UserInfoRepository $userInfoRepository */
        $userInfoRepository = $this->app->make(UserInfoRepository::class);
        $ui = $userInfoRepository->getByID($u->getUserID());

        $mailbox = UserPrivateMessageMailbox::get($ui, (int)$mailboxId);
        $msg = UserPrivateMessage::getByID((int)$messageId, $mailbox);

        if ($msg instanceof UserPrivateMessage) {
            if ($ui->canReadPrivateMessage($msg)) {
                $msg->markAsRead();

                $this->set(
                    'deleteUrl',
                    (string)Url::to(
                        "/account/messages/delete",
                        $mailbox->getMailboxID(),
                        $msg->getMessageID(),
                        $this->app->make(Token::class)->generate('message_delete_' . $msg->getMessageID())
                    )
                );

                $userSelectInstanceFactory = $this->app->make(UserSelectInstanceFactory::class);
                $userSelectInstance = $userSelectInstanceFactory->createInstance('username', true);
                $this->set('token', $this->app->make('token'));
                $this->set('userSelectAccessToken', $userSelectInstance->getAccessToken());
                $this->set("mailbox", $mailbox);
                $this->set('sender', $msg->getMessageAuthorObject());
                $this->set("msg", $msg);
                $this->render("/account/messages/details");
            } else {
                return $responseFactory->forbidden(Page::getCurrentPage());
            }
        } else {
            return $responseFactory->notFound(t("Not Found"));
        }
    }

    public function reply($msgMailboxID = 0, $msgID = 0)
    {
        $this->set('openComposeWindow', true);
        $this->details($msgMailboxID, $msgID);
    }

    public function view($msgMailboxID = UserPrivateMessageMailbox::MBTYPE_INBOX)
    {
        /** @var User $u */
        $u = $this->app->make(User::class);
        /** @var UserInfoRepository $userInfoRepository */
        $userInfoRepository = $this->app->make(UserInfoRepository::class);
        $ui = $userInfoRepository->getByID($u->getUserID());
        $inbox = UserPrivateMessageMailbox::get($ui, UserPrivateMessageMailbox::MBTYPE_INBOX);
        $sent = UserPrivateMessageMailbox::get($ui, UserPrivateMessageMailbox::MBTYPE_SENT);
        $mailbox = UserPrivateMessageMailbox::get($ui, (int)$msgMailboxID);

        $userSelectInstanceFactory = $this->app->make(UserSelectInstanceFactory::class);
        $userSelectInstance = $userSelectInstanceFactory->createInstance('username', true);

        if ($mailbox instanceof Mailbox) {
            $messageList = $mailbox->getMessageList();
            $messages = $messageList->getPage();
            $this->set('messages', $messages);
            $this->set('messageList', $messageList);
            $this->set('mailbox', $mailbox);
            $this->set('inbox', $inbox);
            $this->set('sent', $sent);
            $this->set('currentPage', (int)$this->request('p'));
            $this->set('userSelectAccessToken', $userSelectInstance->getAccessToken());
        } else {
            return $this->responseFactory->redirect(
                (string)Url::to("/account/messages"),
                Response::HTTP_TEMPORARY_REDIRECT
            );
        }
    }
}
