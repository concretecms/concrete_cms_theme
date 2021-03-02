<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\API\V1;

use Concrete\Core\Application\EditResponse;
use Concrete\Core\Entity\Express\Entry;
use Concrete\Core\Entity\File\File;
use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\Express\EntryBuilder;
use Concrete\Core\Express\ObjectManager;
use Concrete\Core\File\Import\FileImporter;
use Concrete\Core\File\Import\ImportException;
use Concrete\Core\Form\Service\Validation;
use Concrete\Core\Http\Request;
use Concrete\Core\User\User;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Exception;

class ShowcaseItems
{
    protected $request;
    protected $importer;
    protected $objectManager;

    public function __construct(
        Request $request,
        FileImporter $importer,
        ObjectManager $objectManager
    )
    {
        $this->request = $request;
        $this->importer = $importer;
        $this->objectManager = $objectManager;
    }

    /**
     * @param string $url
     * @return bool
     * @throws Exception
     */
    private function checkSiteUrl($url)
    {
        if (filter_var($url, FILTER_VALIDATE_URL)) {

        } else {
            throw new Exception(t("The given url is invalid."));
        }

        $client = new Client(['timeout' => 15.0]);

        try {
            $response = $client->get($url);
        } catch (RequestException $e) {
            throw new Exception(t("The given url can not be found."));
        }

        if ($response instanceof Response) {
            $body = $response->getBody();
            $html = $body->getContents();

            preg_match_all('/<meta name="generator" content="([^"]+)">/', $html, $matches, PREG_SET_ORDER);

            if (is_array($matches) && isset($matches[0]) && isset($matches[0][1])) {
                if (strpos($matches[0][1], "concrete") !== false) {
                    return true;
                }
            }

            throw new Exception(t("The given url is not a valid concrete5/concreteCMS site."));
        } else {
            throw new Exception(t("The given url can not be found."));
        }
    }

    /**
     * @param UploadedFile $file
     * @return bool
     * @throws Exception
     */
    private function checkFile(
        $file
    )
    {
        $maxFileSize = 2 * 1024 * 1024;

        if ($file instanceof UploadedFile) {
            if ($file->getSize() > $maxFileSize) {
                throw new Exception(t("The file size is to big."));
            } else {
                $pathParts = pathinfo($file->getClientOriginalName());
                $fileExtension = $pathParts['extension'];

                if (strtolower($fileExtension) === "jpg" || strtolower($fileExtension) === "jpeg") {
                    return true;
                } else {
                    throw new Exception(t("Only JPEG files are allowed"));
                }
            }
        } else {
            return true;
        }
    }

    public function create()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();
        $formValidator = new Validation();
        $user = new User();

        if ($user->isRegistered()) {
            $formValidator->setFiles();
            $formValidator->setData($this->request->request->all());
            $formValidator->addRequiredToken("");
            $formValidator->addRequired("siteUrl", t("You need to enter a valid site url."));
            $formValidator->addRequired("title", t("You need to enter a valid title."));
            $formValidator->addRequired("shortDescription", t("You need to enter a valid short description."));
            $formValidator->addUploadedFile("requiredImage", t("You need to select at least the required image."), false);

            if ($formValidator->test()) {
                $siteUrl = $this->request->request->get("siteUrl");
                $title = $this->request->request->get("title");
                $shortDescription = $this->request->request->get("shortDescription");

                try {
                    $this->checkSiteUrl($siteUrl);
                } catch (Exception $e) {
                    $errorList->add($e->getMessage());
                }

                if (!$errorList->has()) {
                    $requiredImage = $this->request->files->get("requiredImage");
                    $additionalImage1 = $this->request->files->get("additionalImage1");
                    $additionalImage2 = $this->request->files->get("additionalImage2");
                    $additionalImage3 = $this->request->files->get("additionalImage3");

                    try {
                        $this->checkFile($requiredImage);
                        $this->checkFile($additionalImage1);
                        $this->checkFile($additionalImage2);
                        $this->checkFile($additionalImage3);
                    } catch (Exception $e) {
                        $errorList->add($e->getMessage());
                    }

                    if (!$errorList->has()) {
                        $entry = $this->objectManager->buildEntry("showcase_item");

                        if ($entry instanceof EntryBuilder) {
                            $entry->setAttribute("site_url", $siteUrl);
                            $entry->setAttribute("title", $title);
                            $entry->setAttribute("short_description", $shortDescription);
                            $entry->setAttribute("author", $user->getUserInfoObject()->getEntityObject());

                            try {
                                $entry->setAttribute("required_image", $this->importer->importUploadedFile($requiredImage)->getFile());

                                if ($additionalImage1 instanceof UploadedFile) {
                                    $entry->setAttribute("additional_image_1", $this->importer->importUploadedFile($additionalImage1)->getFile());
                                }

                                if ($additionalImage2 instanceof UploadedFile) {
                                    $entry->setAttribute("additional_image_2", $this->importer->importUploadedFile($additionalImage2)->getFile());
                                }

                                if ($additionalImage3 instanceof UploadedFile) {
                                    $entry->setAttribute("additional_image_3", $this->importer->importUploadedFile($additionalImage3)->getFile());
                                }

                                $entry->save();

                                $response->setMessage(t("The showcase item has been successfully created."));

                            } catch (ImportException $e) {
                                $errorList->add(t("There was an error while saving the given file."));
                            }
                        }
                    }
                }

            } else {
                /** @noinspection PhpUndefinedMethodInspection */
                foreach ($formValidator->getError()->getList() as $error) {
                    $errorList->add($error);
                }
            }
        } else {
            $errorList->add(t("You need to be logged in to create a showcase item."));
        }

        $response->setError($errorList);

        return new JsonResponse($response);
    }

    public function read()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();
        $formValidator = new Validation();
        $user = new User();

        $formValidator->setData($this->request->query->all());
        $formValidator->addRequired("showcaseItemId", t("You need to enter a valid showcase item id."));

        if ($user->isRegistered()) {
            if ($formValidator->test()) {
                $showcaseItemId = (string)$this->request->query->get("showcaseItemId");

                $entry = $this->objectManager->getEntry($showcaseItemId);

                if ($entry instanceof Entry) {
                    if ($entry->getEntity()->getHandle() === "showcase_item") {
                        if ($user->getUserID() == $entry->getAttribute("author")) {
                            /** @noinspection PhpUndefinedMethodInspection */
                            $response->setAdditionalDataAttribute("showcaseItem", [
                                "siteUrl" => (string)$entry->getAttribute("site_url"),
                                "title" => (string)$entry->getAttribute("title"),
                                "shortDescription" => (string)$entry->getAttribute("short_description"),
                                "requiredImage" => $entry->getAttribute("required_image") instanceof File ? [
                                    "fID" => (int)$entry->getAttribute("required_image")->getFileID(),
                                    "fName" => $entry->getAttribute("required_image")->getFileName()
                                ] : null,
                                "additionalImage1" => $entry->getAttribute("additional_image_1") instanceof File ? [
                                    "fID" => (int)$entry->getAttribute("additional_image_1")->getFileID(),
                                    "fName" => $entry->getAttribute("additional_image_1")->getFileName()
                                ] : null,
                                "additionalImage2" => $entry->getAttribute("additional_image_2") instanceof File ? [
                                    "fID" => (int)$entry->getAttribute("additional_image_2")->getFileID(),
                                    "fName" => $entry->getAttribute("additional_image_2")->getFileName()
                                ] : null,
                                "additionalImage3" => $entry->getAttribute("additional_image_3") instanceof File ? [
                                    "fID" => (int)$entry->getAttribute("additional_image_3")->getFileID(),
                                    "fName" => $entry->getAttribute("additional_image_3")->getFileName()
                                ] : null
                            ]);
                        } else {
                            $errorList->add(t("You are not the owner of that showcase item."));
                        }
                    } else {
                        $errorList->add(t("The given id is invalid."));
                    }
                } else {
                    $errorList->add(t("The given id is invalid."));
                }
            } else {
                /** @noinspection PhpUndefinedMethodInspection */
                foreach ($formValidator->getError()->getList() as $error) {
                    $errorList->add($error);
                }
            }
        } else {
            $errorList->add(t("You need to be logged in to get information about a showcase item."));
        }

        $response->setError($errorList);
        return new JsonResponse($response);
    }

    public function update()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();
        $formValidator = new Validation();
        $user = new User();
        $fileIds = $this->request->request->get("fileIds", []);

        if ($user->isRegistered()) {
            $formValidator->setFiles();
            $formValidator->setData($this->request->request->all());
            $formValidator->addRequiredToken("");
            $formValidator->addRequired("siteUrl", t("You need to enter a valid site url."));
            $formValidator->addRequired("title", t("You need to enter a valid title."));
            $formValidator->addRequired("shortDescription", t("You need to enter a valid short description."));

            if (is_array($fileIds) && $fileIds["requiredImage"] == "") {
                $formValidator->addUploadedFile("requiredImage", t("You need to select at least the required image."), false);
            }

            if ($formValidator->test()) {
                $siteUrl = $this->request->request->get("siteUrl");
                $title = $this->request->request->get("title");
                $shortDescription = $this->request->request->get("shortDescription");

                try {
                    $this->checkSiteUrl($siteUrl);
                } catch (Exception $e) {
                    $errorList->add($e->getMessage());
                }

                if (!$errorList->has()) {
                    $requiredImage = $this->request->files->get("requiredImage");
                    $additionalImage1 = $this->request->files->get("additionalImage1");
                    $additionalImage2 = $this->request->files->get("additionalImage2");
                    $additionalImage3 = $this->request->files->get("additionalImage3");

                    try {
                        if (is_array($fileIds) && $fileIds["requiredImage"] == "") {
                            $this->checkFile($requiredImage);
                        }

                        if (is_array($fileIds) && $fileIds["additionalImage1"] == "") {
                            $this->checkFile($additionalImage1);
                        }

                        if (is_array($fileIds) && $fileIds["additionalImage2"] == "") {
                            $this->checkFile($additionalImage2);
                        }

                        if (is_array($fileIds) && $fileIds["additionalImage3"] == "") {
                            $this->checkFile($additionalImage3);
                        }
                    } catch (Exception $e) {
                        $errorList->add($e->getMessage());
                    }

                    if (!$errorList->has()) {
                        $showcaseItemId = (string)$this->request->request->get("showcaseItemId");

                        $entry = $this->objectManager->getEntry($showcaseItemId);

                        if ($entry instanceof Entry) {
                            if ($entry->getEntity()->getHandle() === "showcase_item") {
                                if ($user->getUserID() == $entry->getAttribute("author")) {
                                    $entry->setAttribute("site_url", $siteUrl);
                                    $entry->setAttribute("title", $title);
                                    $entry->setAttribute("short_description", $shortDescription);
                                    $entry->setAttribute("author", $user->getUserInfoObject()->getEntityObject());

                                    try {
                                        if (is_array($fileIds) && !isset($fileIds["requiredImage"])) {
                                            $entry->setAttribute("required_image", $this->importer->importUploadedFile($requiredImage)->getFile());
                                        }

                                        if ($additionalImage1 instanceof UploadedFile) {
                                            $entry->setAttribute("additional_image_1", $this->importer->importUploadedFile($additionalImage1)->getFile());
                                        } else if (is_array($fileIds) && $fileIds["additionalImage1"] == "") {
                                            $entry->setAttribute("additional_image_1", null);
                                        }

                                        if ($additionalImage2 instanceof UploadedFile) {
                                            $entry->setAttribute("additional_image_2", $this->importer->importUploadedFile($additionalImage2)->getFile());
                                        } else if (is_array($fileIds) && $fileIds["additionalImage2"] == "") {
                                            $entry->setAttribute("additional_image_2", null);
                                        }

                                        if ($additionalImage3 instanceof UploadedFile) {
                                            $entry->setAttribute("additional_image_3", $this->importer->importUploadedFile($additionalImage3)->getFile());
                                        } else if (is_array($fileIds) && $fileIds["additionalImage3"] == "") {
                                            $entry->setAttribute("additional_image_3", null);
                                        }

                                        $entry->save();

                                        $response->setMessage(t("The showcase item has been successfully updated."));

                                    } catch (ImportException $e) {
                                        $errorList->add(t("There was an error while saving the given file."));
                                    }
                                } else {
                                    $errorList->add(t("You are not the owner of that showcase item."));
                                }
                            } else {
                                $errorList->add(t("The given id is invalid."));
                            }
                        } else {
                            $errorList->add(t("The given id is invalid."));
                        }
                    }
                }

            } else {
                /** @noinspection PhpUndefinedMethodInspection */
                foreach ($formValidator->getError()->getList() as $error) {
                    $errorList->add($error);
                }
            }
        } else {
            $errorList->add(t("You need to be logged in to create a showcase item."));
        }

        $response->setError($errorList);

        return new JsonResponse($response);
    }

    public function delete()
    {
        $response = new EditResponse();
        $errorList = new ErrorList();
        $formValidator = new Validation();
        $user = new User();

        $formValidator->setData($this->request->query->all());
        $formValidator->addRequired("showcaseItemId", t("You need to enter a valid showcase item id."));

        if ($user->isRegistered()) {
            if ($formValidator->test()) {
                $showcaseItemId = (string)$this->request->query->get("showcaseItemId");

                $entry = $this->objectManager->getEntry($showcaseItemId);

                if ($entry instanceof Entry) {
                    if ($entry->getEntity()->getHandle() === "showcase_item") {
                        if ($user->getUserID() == $entry->getAttribute("author")) {
                            $this->objectManager->deleteEntry($entry);

                            $response->setMessage(t("You have successfully removed the showcase item."));
                        } else {
                            $errorList->add(t("You are not the owner of that showcase item."));
                        }
                    } else {
                        $errorList->add(t("The given id is invalid."));
                    }
                } else {
                    $errorList->add(t("The given id is invalid."));
                }
            } else {
                /** @noinspection PhpUndefinedMethodInspection */
                foreach ($formValidator->getError()->getList() as $error) {
                    $errorList->add($error);
                }
            }
        } else {
            $errorList->add(t("You need to be logged in to remove the a showcase item."));
        }

        $response->setError($errorList);
        return new JsonResponse($response);
    }
}