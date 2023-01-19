<?php /** @noinspection PhpInconsistentReturnPointsInspection */
/** @noinspection PhpUnused */

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Account;

use Concrete\Core\Antispam\Service;
use Concrete\Core\Attribute\Category\CategoryService;
use Concrete\Core\Attribute\Category\UserCategory;
use Concrete\Core\Attribute\Controller;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Encryption\PasswordHasher;
use Concrete\Core\Entity\Attribute\Category;
use Concrete\Core\Entity\Attribute\Key\UserKey;
use Concrete\Core\Entity\Attribute\Set;
use Concrete\Core\Entity\File\Version;
use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\Error\UserMessageException;
use Concrete\Core\File\Import\FileImporter;
use Concrete\Core\Http\Request;
use Concrete\Core\Http\Response;
use Concrete\Core\Localization\Localization;
use Concrete\Core\Routing\RedirectResponse;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\Avatar\AvatarService;
use Concrete\Core\User\Command\UpdateUserAvatarCommand;
use Concrete\Core\User\User;
use Concrete\Core\User\UserInfo;
use Concrete\Core\Validation\CSRF\Token;
use Concrete\Core\Validator\PasswordValidatorServiceProvider;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Psr7\Uri;
use PortlandLabs\ConcreteCmsTheme\Page\Controller\AccountPageController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;

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
            $errorList->add(t("You need to create a user account first at forums.concretecms.org."));
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
            $this->error = $errorList;
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

        $locales = [];
        $languages = Localization::getAvailableInterfaceLanguages();
        if (count($languages) > 0) {
            array_unshift($languages, Localization::BASE_LOCALE);
        }
        if (count($languages) > 0) {
            foreach ($languages as $lang) {
                $locales[$lang] = \Punic\Language::getName($lang, $lang);
            }
            asort($locales);
            $locales = array_merge(['' => tc('Default locale', '** Default')], $locales);
        }
        $this->set('locales', $locales);

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
        $this->set('updatePasswordAction', $this->action('update_password'));
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

        $toTest = [];

        foreach ($aks as $uak) {
            /** @var Controller $controller */
            $controller = $uak->getController();
            $validator = $controller->getValidator();

            $response = $validator->validateSaveValueRequest($controller, $this->request, $uak->isAttributeKeyRequiredOnProfile());

            if (!$response->isValid()) {
                $error = $response->getErrorObject();
                $this->error->add($error);
            } elseif (in_array($uak->getAttributeTypeHandle(), ['textarea', 'text'])) {
                $toTest[] = [$uak->getAttributeKeyName(), $controller->post('value')];
            }
        }

        if ($toTest) {
            $toTest = array_filter(array_map(fn($test) => trim($test[1]) ? "{$test[1]}" : null, $toTest));

            /** @var Service $antispam */
            $antispam = $this->app->make(Service::class);
            $notSpam = $antispam->check(implode("\n\n", $toTest), 'signup', ['user' => $ui]);

            if (!$notSpam) {
                $this->error->add('Unable to save, profile flagged as spam.');
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

    public function update_password(): JsonResponse
    {
        $code = Response::HTTP_OK;
        $field = [];
        $requirements = [];

        $newPassword = $this->post('password');
        $newPasswordRepeat = $this->post('password2');
        $currentPassword = $this->post('currentPassword');
        $token = $this->post('ccm_token');

        // Validate CSRF
        $tokenValidator = $this->app->make(Token::class);
        if (!$tokenValidator->validate('update_password', $token)) {
            $this->error->add(t('Invalid token provided, refresh and try again.'));
            $code = Response::HTTP_UNAUTHORIZED;
        }

        // Make sure the passwords match
        if ($newPassword !== $newPasswordRepeat) {
            $field[] = 'password';
            $field[] = 'password2';
            $this->error->add(t('The new passwords do not match.'));
            $code = Response::HTTP_BAD_REQUEST;
        }

        // Make sure the given password matches the stored password hash
        if (!$this->error->has()) {
            $user = $this->app->make(User::class);
            $userInfo = $user->getUserInfoObject();

            // Validate against password requirements
            $validator = $this->app->make('validator/password');
            if (!$validator->isValidFor($newPassword, $userInfo, $this->error)) {
                $field[] = 'password';
                $field[] = 'password2';
                $code = Response::HTTP_BAD_REQUEST;
            }

            if (!$this->error->has()) {
                $hasher = $this->app->make(PasswordHasher::class);
                if (!$user->isRegistered() || !$hasher->checkPassword($currentPassword, $userInfo->getUserPassword())) {
                    $field[] = 'currentPassword';
                    $this->error->add('Invalid password.');
                    $code = Response::HTTP_UNAUTHORIZED;
                }
            }
        }

        $result = ['error' => false, 'message' => [], 'fields' => [], 'requirements' => array_unique($requirements)];
        if ($code !== 200 || $this->error->has()) {
            $result['error'] = true;
            $result['message'] = $this->error->jsonSerialize()['errors'];
            $result['fields'] = array_unique($field);
        } else {
            // Update the user's password
            $userInfo->changePassword($newPassword);
        }

        return new JsonResponse($result, $code);
    }

}
