<?php /** @noinspection PhpInconsistentReturnPointsInspection */
/** @noinspection PhpUnused */

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Account;

use Concrete\Core\Attribute\Category\CategoryService;
use Concrete\Core\Attribute\Category\UserCategory;
use Concrete\Core\Attribute\Controller;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Entity\Attribute\Category;
use Concrete\Core\Entity\Attribute\Key\UserKey;
use Concrete\Core\Entity\Attribute\Set;
use Concrete\Core\Entity\File\Version;
use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\Error\UserMessageException;
use Concrete\Core\File\Import\FileImporter;
use Concrete\Core\Http\Request;
use Concrete\Core\Http\Response;
use Concrete\Core\Routing\RedirectResponse;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\Avatar\AvatarService;
use Concrete\Core\User\Command\UpdateUserAvatarCommand;
use Concrete\Core\User\User;
use Concrete\Core\User\UserInfo;
use Concrete\Core\Validation\CSRF\Token;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Psr7\Uri;
use PortlandLabs\ConcreteCmsTheme\Page\Controller\AccountPageController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Exception;

/** @noinspection PhpInconsistentReturnPointsInspection */

class EditProfile extends AccountPageController
{

    public function edit_forums_settings()
    {
        $currentUser = new User();
        $app = Application::getFacadeApplication();
        /** @var Repository $config */
        $config = $app->make(Repository::class);
        $errorList = new ErrorList();
        $discourseEndpoint = $config->get("concrete_cms_community.discourse.endpoint");
        $discourseApiKey = $config->get("concrete_cms_community.discourse.api_key");
        $baseUrl = new Uri($discourseEndpoint);
        $client = new Client();
        $discourseUsername = "";

        $apiUrl = $baseUrl
            ->withPath(
                sprintf(
                    "/u/by-external/%s.json",
                    (string)$currentUser->getUserID()
                )
            );

        try {
            $response = $client->request("GET", $apiUrl, [
                "headers" => [
                    "Api-Key" => $discourseApiKey
                ]
            ]);

            if ($response->getStatusCode() === Response::HTTP_OK) {
                $rawResponse = $response->getBody()->getContents();
                $json = json_decode($rawResponse, true);

                if (isset($json["user"]["username"])) {
                    $discourseUsername = $json["user"]["username"];
                } else {
                    $errorList->add(t("Error while looking up the user details. Invalid payload."));
                }
            } else {
                $errorList->add(t("Error while looking up the user details. Invalid status code."));
            }

        } catch (GuzzleException $e) {
            $errorList->add(t("Error while looking up the user details. Internal server error."));
        }

        if (!$errorList->has()) {
            $redirectUrl = (string)$baseUrl
                ->withPath(
                    sprintf(
                        "/u/%s/preferences/email",
                        $discourseUsername
                    )
                );

            return new RedirectResponse($redirectUrl, Response::HTTP_TEMPORARY_REDIRECT);
        } else {
            $this->set('error', $errorList);
            $this->view();
        }
    }

    public function remove_avatar()
    {
        /** @var UserInfo $profile */
        $profile = $this->get('profile');
        /** @var AvatarService $avatarService */
        $avatarService = $this->app->make(AvatarService::class);
        $avatarService->removeAvatar($profile);
        return $this->responseFactory->redirect((string)Url::to('/account/edit_profile', 'avatar_removed'), Response::HTTP_TEMPORARY_REDIRECT);
    }

    public function remove_header_image()
    {
        /** @var UserInfo $profile */
        $profile = $this->get('profile');
        $profile->setAttribute("header_image", null);
        return $this->responseFactory->redirect((string)Url::to('/account/edit_profile', 'header_image_removed'), Response::HTTP_TEMPORARY_REDIRECT);
    }

    public function header_image_removed()
    {
        $this->set('success', t('The header image has been successfully removed.'));
        /** @noinspection PhpUnhandledExceptionInspection */
        $this->view();
    }

    public function avatar_removed()
    {
        $this->set('success', t('The profile picture has been successfully removed.'));
        /** @noinspection PhpUnhandledExceptionInspection */
        $this->view();
    }

    public function avatar_uploaded()
    {
        $this->set('success', t('The profile picture has been successfully changed.'));
        /** @noinspection PhpUnhandledExceptionInspection */
        $this->view();
    }

    public function header_image_uploaded()
    {
        $this->set('success', t('The header image has been successfully changed.'));
        /** @noinspection PhpUnhandledExceptionInspection */
        $this->view();
    }

    public function upload_header_image()
    {
        /** @var UserInfo $profile */
        $profile = $this->get('profile');

        /** @var Token $token */
        $token = $this->app->make(Token::class);

        if (!$token->validate('upload_header_image', $this->request->query->get('ccm_token'))) {
            $this->error->add($token->getErrorMessage());
        } else {
            $file = $this->request->files->get('header_image');

            if ($file instanceof UploadedFile) {
                /** @var FileImporter $fileImporter */
                $fileImporter = $this->app->make(FileImporter::class);
                try {
                    $fileVersion = $fileImporter->importUploadedFile($file);
                    if ($fileVersion instanceof Version) {
                        if ($fileVersion->getImagineImage() !== null) {
                            $profile->setAttribute("header_image", $fileVersion->getFile());
                            return $this->responseFactory->redirect((string)Url::to('/account/edit_profile', 'header_image_uploaded'), Response::HTTP_TEMPORARY_REDIRECT);
                        } else {
                            $fileVersion->delete();

                            $this->error->add(t("Please select a valid image file."));
                        }
                    }
                } catch (Exception $exception) {
                    $this->error->add($exception);
                }
            }
        }
    }

    public function upload_avatar()
    {
        /** @var UserInfo $profile */
        $profile = $this->get('profile');

        /** @var Token $token */
        $token = $this->app->make(Token::class);

        if (!$token->validate('upload_avatar', $this->request->query->get('ccm_token'))) {
            $this->error->add($token->getErrorMessage());
        } else {
            $file = $this->request->files->get('avatar');

            if ($file instanceof UploadedFile) {
                try {
                    $command = new UpdateUserAvatarCommand($profile, $file);

                    $this->app->executeCommand($command);

                    return $this->responseFactory->redirect((string)Url::to('/account/edit_profile', 'avatar_uploaded'), Response::HTTP_TEMPORARY_REDIRECT);
                } catch (Exception $exception) {
                    $this->error->add($exception);
                }
            } else {
                $this->error->add(t("You need to select a valid file."));
            }
        }

        $this->view();
    }

    /**
     * @throws UserMessageException
     */
    public function view()
    {
        $profile = $this->get('profile');

        if (!is_object($profile)) {
            throw new UserMessageException(t('You must be logged in to access this page.'));
        }

        /** @var CategoryService $service */
        $service = $this->app->make(CategoryService::class);

        /** @var Category $categoryEntity */
        $categoryEntity = $service->getByHandle('user');
        $category = $categoryEntity->getController();
        $setManager = $category->getSetManager();
        $attributeSets = [];

        foreach ($setManager->getAttributeSets() as $set) {
            foreach ($set->getAttributeKeys() as $ak) {
                if ($ak->isAttributeKeyEditableOnProfile()) {
                    $attributeSets[$set->getAttributeSetDisplayName()][] = $ak;
                }
            }
        }

        $this->set('attributeSets', $attributeSets);

        $unassignedAttributes = [];

        foreach ($setManager->getUnassignedAttributeKeys() as $ak) {
            if ($ak->isAttributeKeyEditableOnProfile()) {
                $unassignedAttributes[] = $ak;
            }
        }

        $this->set('unassignedAttributes', $unassignedAttributes);
    }

    /**
     * @throws UserMessageException
     */
    public function save_complete()
    {
        $this->set('success', t('Profile updated successfully.'));
        $this->view();
    }

    /**
     * @throws UserMessageException
     */
    public function save()
    {
        $this->view();

        $ui = $this->get('profile');
        /* @var UserInfo $ui */

        $app = $this->app;

        $valt = $app->make('token');

        if (!$valt->validate('profile_edit')) {
            $this->error->add($valt->getErrorMessage());
        }

        // validate the user's email
        $email = $this->post('uEmail');
        $app->make('validator/user/email')->isValidFor($email, $ui, $this->error);

        // Username validation
        $username = $this->post('uName');

        if ($username) {
            $app->make('validator/user/name')->isValidFor($username, $ui, $this->error);
        }

        /** @var UserCategory $userCategory */
        $userCategory = $this->app->make(UserCategory::class);
        /** @var UserKey[] $aks */
        $aks = $userCategory->getEditableInProfileList();

        foreach ($aks as $uak) {
            /** @var Controller $controller */
            $controller = $uak->getController();
            $validator = $controller->getValidator();

            $response = $validator->validateSaveValueRequest($controller, $this->request, $uak->isAttributeKeyRequiredOnProfile());

            if (!$response->isValid()) {
                $error = $response->getErrorObject();
                $this->error->add($error);
            }
        }

        if (!$this->error->has()) {
            $data['uName'] = $username;

            /** @noinspection PhpParamsInspection */
            $ui->saveUserAttributesForm($aks);
            $ui->update($data);

            return $this->responseFactory->redirect((string)Url::to('/account/edit_profile', 'save_complete'), Response::HTTP_TEMPORARY_REDIRECT);
        }
    }

}