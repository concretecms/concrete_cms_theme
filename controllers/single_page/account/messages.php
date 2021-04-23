<?php /** @noinspection PhpInconsistentReturnPointsInspection */
/** @noinspection PhpUnused */
/** @noinspection DuplicatedCode */

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Account;

use Concrete\Core\Http\Response;
use Concrete\Core\Http\ResponseFactory;
use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\PrivateMessage\Mailbox;
use Concrete\Core\User\PrivateMessage\Mailbox as UserPrivateMessageMailbox;
use Concrete\Core\User\PrivateMessage\PrivateMessage as UserPrivateMessage;
use Concrete\Core\User\User;
use Concrete\Core\User\UserInfoRepository;
use PortlandLabs\ConcreteCmsTheme\Page\Controller\AccountPageController;

class Messages extends AccountPageController
{
    public function write($receiverId = null)
    {
        $this->view();
        $this->set('receiverId', $receiverId);
    }

    public function delete($mailboxId = null, $messageId = null)
    {/** @var ResponseFactory $responseFactory */
        $responseFactory = $this->app->make(ResponseFactory::class);
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

                return $responseFactory->redirect((string)Url::to("/account/messages"), Response::HTTP_TEMPORARY_REDIRECT);
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

        $mailbox = UserPrivateMessageMailbox::get($ui, $mailboxId);
        $msg = UserPrivateMessage::getByID($messageId, $mailbox);

        if ($msg instanceof UserPrivateMessage) {
            if ($ui->canReadPrivateMessage($msg)) {
                $msg->markAsRead();

                $this->set("mailbox", $mailbox);
                $this->set("msg", $msg);
                $this->render("/account/messages/details");
            } else {
                return $responseFactory->forbidden(Page::getCurrentPage());
            }
        } else {
            return $responseFactory->notFound(t("Not Found"));
        }
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
        $mailbox = UserPrivateMessageMailbox::get($ui, $msgMailboxID);

        if ($mailbox instanceof Mailbox) {
            $messageList = $mailbox->getMessageList();
            $messages = $messageList->getPage();
            $this->set('messages', $messages);
            $this->set('messageList', $messageList);
            $this->set('mailbox', $mailbox);
            $this->set('inbox', $inbox);
            $this->set('sent', $sent);
        } else {
            return $this->responseFactory->redirect((string)Url::to("/account/messages"), Response::HTTP_TEMPORARY_REDIRECT);
        }
    }
}