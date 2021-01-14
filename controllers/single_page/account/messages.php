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
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\PrivateMessage\Mailbox;
use Concrete\Core\User\PrivateMessage\Mailbox as UserPrivateMessageMailbox;
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