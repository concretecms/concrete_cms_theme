<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\API\V1;

use Concrete\Core\Application\Application;
use Concrete\Core\Application\EditResponse;
use Concrete\Core\Database\Connection\Connection;
use Concrete\Core\Entity\File\Version;
use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\File\Import\FileImporter;
use Concrete\Core\File\Import\ImportException;
use Concrete\Core\Form\Service\Validation;
use Concrete\Core\Http\Request;
use Concrete\Core\Localization\Service\Date;
use Concrete\Core\User\PrivateMessage\Mailbox as UserPrivateMessageMailbox;
use Concrete\Core\User\PrivateMessage\PrivateMessage as UserPrivateMessage;
use Concrete\Core\User\User;
use Concrete\Core\User\UserInfo;
use Concrete\Core\User\UserInfoRepository;
use Concrete\Core\Validation\CSRF\Token;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;

class Messages
{
    protected $request;
    protected $app;
    protected $user;
    protected $userInfoRepository;
    protected $userInfo;
    protected $dateHelper;
    protected $token;
    protected $validation;
    protected $importer;
    protected $connection;

    public function __construct(
        Request $request,
        Application $app,
        User $user,
        UserInfoRepository $userInfoRepository,
        Date $dateHelper,
        Token $token,
        Validation $validation,
        FileImporter $importer,
        Connection $connection
    )
    {
        $this->request = $request;
        $this->app = $app;
        $this->user = $user;
        $this->userInfoRepository = $userInfoRepository;
        $this->userInfo = $this->userInfoRepository->getByID($this->user->getUserID());
        $this->dateHelper = $dateHelper;
        $this->token = $token;
        $this->validation = $validation;
        $this->importer = $importer;
        $this->connection = $connection;
    }

    protected function validateUser($uID)
    {
        return $ui = $this->userInfoRepository->getByID($uID) instanceof UserInfo;
        //return (($ui = $this->userInfoRepository->getByID($uID)) instanceof UserInfo && ($ui->getAttribute('profile_private_messages_enabled') == 1));
    }

    public function compose()
    {
        $messageData = [
            "msgID" => '',
            "msgSubject" => '',
            "msgBody" => '',
            "uID" => '',
            "uName" => '',
            "box" => '',
            "sendMessageToken" => $this->token->generate("validate_send_message"),
            "searchUserToken" => $this->token->generate('quick_user_select_receiver')
        ];

        $response = new EditResponse();
        $errorList = new ErrorList();

        if (!$this->user->isRegistered()) {
            $errorList->add(t("You are not logged in."));
            $messageData["requireLogin"] = true;
        }

        if (!$errorList->has()) {
            $mailbox = UserPrivateMessageMailbox::get($this->userInfo, UserPrivateMessageMailbox::MBTYPE_INBOX);
            $messageData["box"] = $mailbox->getMailboxID();

            if ($this->request->query->has("msgID") && $this->request->query->getInt("msgID") > 0) {
                $messageId = (int)$this->request->query->get("msgID");

                $msg = UserPrivateMessage::getByID($messageId, $mailbox);

                if (!$msg) {
                    $errorList->add(t('Message not found.'));
                } elseif (!$this->userInfo->canReadPrivateMessage($msg)) {
                    $errorList->add(t('Access Denied.'));
                }

                if (!$errorList->has()) {
                    if ($this->validateUser($msg->getMessageRelevantUserID())) {
                        $ui = $this->userInfoRepository->getByID($msg->getMessageRelevantUserID());

                        $messageData["msgID"] = $msg->getMessageID();
                        $messageData["msgSubject"] = t("Re: %s", $msg->getMessageSubject());

                        $body = "\n\n\n" . $msg->getMessageDelimiter() . "\n";
                        /** @noinspection PhpUnhandledExceptionInspection */
                        $body .= t("From: %s\nDate Sent: %s\nSubject: %s", $msg->getMessageAuthorName(), $this->dateHelper->formatDateTime($msg->getMessageDateAdded(), true), $msg->getMessageSubject());
                        $body .= "\n\n" . $msg->getMessageBody();

                        // append attachments to body
                        $attachmentString = "";

                        foreach ($msg->getAttachments() as $attachment) {
                            $approvedFileVersion = $attachment->getApprovedVersion();
                            if ($approvedFileVersion instanceof Version) {
                                $attachmentString .= sprintf("%s\n", h($approvedFileVersion->getDownloadURL()));
                            }
                        }

                        if (strlen($attachmentString) > 0) {
                            $body .= "\n\n" . t("Attachments: %s\n", $attachmentString);
                        }

                        $messageData["msgBody"] = $body;

                        $messageData["uID"] = $msg->getMessageRelevantUserID();
                        $messageData["uName"] = $ui->getUserName();

                        // mark as read
                        $msg->markAsRead();
                    } else {
                        $errorList->add(t("The user doesn’t want to receive messages."));
                    }
                }
            } else if ($this->request->query->has("uID") && $this->request->query->getInt("uID") > 0) {
                $uID = $this->request->query->getInt('uID');
                $recipient = $this->userInfoRepository->getByID($uID);

                if (!$recipient instanceof UserInfo) {
                    $errorList->add(t("The user doesn't exists."));
                    //} else if ($recipient->getAttribute('profile_private_messages_enabled') != 1) {
                    //    $errorList->add(t("The user doesn’t want to receive messages."));
                } else {
                    $messageData["uID"] = $uID;
                    $messageData["uName"] = $recipient->getUserName();
                }
            }
        }

        $response->setAdditionalDataAttribute("messageData", $messageData);

        $response->setError($errorList);

        return new JsonResponse($response);
    }

    public function send()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();

        $this->validation->setData($this->request->request->all());
        $this->validation->addRequired('uID', t("You need to select a receiver."));
        $this->validation->addRequired('msgSubject', t("You haven't written a subject!"));
        $this->validation->addRequired('msgBody', t("You haven't written a message!"));
        $this->validation->addRequiredToken('validate_send_message');

        if ($this->validation->test()) {
            $uID = $this->request->request->getInt('uID');
            $recipient = $this->userInfoRepository->getByID($uID);

            if (!$recipient instanceof UserInfo) {
                $errorList->add(t("The user doesn't exists."));
            //} else if ($recipient->getAttribute('profile_private_messages_enabled') != 1) {
            //    $errorList->add(t("The user doesn’t want to receive messages."));
            } else {
                $subject = $this->request->request->get("msgSubject");
                $body = $this->request->request->get("msgBody");

                $inReplyTo = null;

                if ($this->request->request->has("msgID") && $this->request->request->getInt("msgID") > 0) {
                    // This message is an reply to another message
                    $msgID = $this->request->request->getInt("msgID");
                    $mailbox = UserPrivateMessageMailbox::get($this->userInfo, UserPrivateMessageMailbox::MBTYPE_INBOX);
                    $inReplyTo = UserPrivateMessage::getByID($msgID, $mailbox);
                }

                // add message attachments
                $attachments = [];

                foreach ($this->request->files->get("msgAttachments") as $uploadedFile) {
                    if ($uploadedFile instanceof UploadedFile) {
                        try {
                            $fileVersion = $this->importer->importUploadedFile($uploadedFile);

                            if ($fileVersion instanceof Version) {
                                $file = $fileVersion->getFile();
                                $attachments[] = $file;
                            }
                        } catch (ImportException $err) {
                            $errorList->add($err);
                        }
                    }
                }

                if (!$errorList->has()) {
                    $r = $this->userInfo->sendPrivateMessage(
                        $recipient,
                        $subject,
                        $body,
                        $inReplyTo,
                        $attachments
                    );

                    if ($r === null) {
                        if ($inReplyTo === null) {
                            $response->setMessage(t("Message sent!"));
                        } else {
                            $response->setMessage(t("Reply sent!"));
                        }
                    } else if ($r === false) {
                        $errorList->add(t("The message was detected as spam."));
                    } else if ($r instanceof ErrorList) {
                        $errorList = $r;
                    }
                }
            }
        } else {
            $errorList = $this->validation->getError();
        }

        $response->setError($errorList);

        return new JsonResponse($response);
    }

    public function delete()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();
        $this->validation->setData($this->request->request->all());
        $this->validation->addRequiredToken('delete_messages');

        if ($this->validation->test()) {
            $messageIds = $this->request->request->get("messageIds", []);
            $box = $this->request->request->get("box");

            $mailbox = UserPrivateMessageMailbox::get($this->userInfo, $box);

            foreach ($messageIds as $messageId) {
                $msg = UserPrivateMessage::getByID($messageId, $mailbox);

                if ($msg === false) {
                    $errorList->add(t("The given message id doesn't exists."));
                } else {
                    $msg->delete();
                }
            }
        } else {
            $errorList = $this->validation->getError();
        }

        $response->setError($errorList);

        return new JsonResponse($response);
    }

    public function read()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();
        $this->validation->setData($this->request->request->all());
        $this->validation->addRequiredToken('mark_read');

        if ($this->validation->test()) {
            $messageIds = $this->request->request->get("messageIds", []);
            $box = $this->request->request->get("box");

            $mailbox = UserPrivateMessageMailbox::get($this->userInfo, $box);

            foreach ($messageIds as $messageId) {
                $msg = UserPrivateMessage::getByID($messageId, $mailbox);

                if ($msg === false) {
                    $errorList->add(t("The given message id doesn't exists."));
                } else {
                    $this->connection->executeQuery('update UserPrivateMessagesTo set msgIsUnread = 0 where msgID = ? and msgMailboxID = ? and uID = ?', array($msg->getMessageID(), $msg->msgMailboxID, $this->userInfo->getUserID()));
                }
            }
        } else {
            $errorList = $this->validation->getError();
        }

        $response->setError($errorList);

        return new JsonResponse($response);
    }

    public function unread()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();
        $this->validation->setData($this->request->request->all());
        $this->validation->addRequiredToken('mark_unread');

        if ($this->validation->test()) {
            $messageIds = $this->request->request->get("messageIds", []);
            $box = $this->request->request->get("box");

            $mailbox = UserPrivateMessageMailbox::get($this->userInfo, $box);

            foreach ($messageIds as $messageId) {
                $msg = UserPrivateMessage::getByID($messageId, $mailbox);

                if ($msg === false) {
                    $errorList->add(t("The given message id doesn't exists."));
                } else {
                    $this->connection->executeQuery('update UserPrivateMessagesTo set msgIsUnread = 1 where msgID = ? and msgMailboxID = ? and uID = ?', array($msg->getMessageID(), $msg->msgMailboxID, $this->userInfo->getUserID()));
                }
            }
        } else {
            $errorList = $this->validation->getError();
        }

        $response->setError($errorList);
        return new JsonResponse($response);
    }
}
