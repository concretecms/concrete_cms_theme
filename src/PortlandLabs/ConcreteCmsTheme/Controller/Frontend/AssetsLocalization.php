<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\Controller\Frontend;

use Concrete\Core\Controller\Controller;
use Concrete\Core\Http\Response;
use Concrete\Core\Http\ResponseFactoryInterface;

class AssetsLocalization extends Controller
{

    const CACHE_OPTIONS = [
        'max_age' => 2592000,
        'public' => true,
    ];

    /**
     * /ccm/assets/localization/core/js route
     */
    public function getCoreJavascript(): Response
    {
        $controller = app(\Concrete\Controller\Frontend\AssetsLocalization::class);
        return $controller->getCoreJavascript()->setCache(self::CACHE_OPTIONS);
    }

    /**
     * /community/js route
     */
    public function getCommunityJavascript(): Response
    {
        /** @noinspection PhpComposerExtensionStubsInspection */
        $content = 'var ccmi18n_community = ' . json_encode([
                "dialogTitle" => t("Send Message"),
                "receiverLabel" => t("To"),
                "subjectLabel" => t("Subject"),
                "attachmentsLabel" => t("Attachments"),
                "messageLabel" => t("Message"),
                "sendButton" => t("Send"),
                "cancelButton" => t("Cancel"),
                "editShowcaseItemDialogTitle" => t("Edit Showcase"),
                "addShowcaseItemDialogTitle" => t("Create Showcase"),
                "saveButton" => t("Save"),
                "siteUrl" => t("Site URL"),
                "title" => t("Title"),
                "shortDescription" => t("Short Description"),
                "requiredImage" => t("Required Image"),
                "additionalImage1" => t("Additional Image 1"),
                "additionalImage2" => t("Additional Image 2"),
                "additionalImage3" => t("Additional Image 3"),
                "uploadNotice" => t("540 x 300px jpg no larger than 2MB"),
                "uploadFilesNotice" => t("Files no larger then %s", ini_get('upload_max_filesize')),
                "uploadFilesButton" => t("Upload Files"),
                "uploadButton" => t("Upload Image"),
                "okayButton" => t("OK"),
                "confirm" => t("Are you sure?"),
                "generalError" => t('An unexpected error occurred.'),
                "userSearch" => [
                    'currentlySelected' => t('Currently Selected'),
                    'emptyTitle' => t('Search Users'),
                    'errorText' => t('Unable to retrieve results'),
                    'searchPlaceholder' => t('Search...'),
                    'statusInitialized' => t('Start typing a search query'),
                    'statusNoResults' => t('No Results'),
                    'statusSearching' => t('Searching...'),
                    'statusTooShort' => t('Please enter more characters'),
                ]
            ]) . ';';

        return $this->createJavascriptResponse($content);
    }

    /**
     * @param string $content
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    private function createJavascriptResponse($content)
    {
        /** @var ResponseFactoryInterface $rf */
        $rf = $this->app->make(ResponseFactoryInterface::class);

        return $rf->create(
            $content,
            Response::HTTP_OK,
            [
                'Content-Type' => 'application/javascript; charset=' . APP_CHARSET,
                'Content-Length' => strlen($content),
            ]
        )->setCache(self::CACHE_OPTIONS);
    }
}
