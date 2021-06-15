<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Attribute\Form\Renderer;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Entity\Attribute\Key\UserKey;
use Concrete\Core\Entity\File\File;
use Concrete\Core\Entity\File\Version;
use Concrete\Core\Form\Service\Form;
use Concrete\Core\Localization\Localization;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\Avatar\EmptyAvatar;
use Concrete\Core\User\UserInfo;
use Concrete\Core\Validation\CSRF\Token;
use Concrete\Core\Page\View\PageView;
use PortlandLabs\ConcreteCmsTheme\Attribute\Context\FrontendFormContext;

/** @var UserKey[]|null $unassignedAttributes */
/** @var Renderer $profileFormRenderer */
/** @var array|null $attributeSets */
/** @var UserInfo $profile */
/** @var PageView $view */

$app = Application::getFacadeApplication();
/** @var Token $token */
$token = $app->make(Token::class);
/** @var Repository $config */
$config = $app->make(Repository::class);
/** @var Form $form */
$form = $app->make(Form::class);

$profileFormRenderer->setContext(new FrontendFormContext());
?>

<div class="edit-profile">
    <div class="container">
        <div class="row">
            <div class="col">
                <?php
                $a = new \Concrete\Core\Area\Area('Header');
                $a->display($c);
                ?>

                <div class="profile-header-image">
                    <div class="profile-header-actions">
                        <?php if ($profile->getAttribute("header_image") instanceof File) { ?>
                            <a href="<?php echo (string)Url::to("/account/edit_profile", "remove_header_image"); ?>"
                               class="btn btn-danger">
                                <?php echo t("Delete Image"); ?>
                            </a>
                        <?php } ?>

                        <form action="<?php echo (string)Url::to("/account/edit_profile", "upload_header_image"); ?>"
                              method="post" enctype="multipart/form-data" id="ccm-upload-header-image">
                            <?php echo $token->output("upload_header_image"); ?>
                            <?php echo $form->file("header_image"); ?>
                            <?php echo $form->label("header_image", t("Change Image"), ["class" => "btn btn-secondary"]); ?>
                        </form>
                    </div>

                    <?php
                    $headerImage = $profile->getAttribute("header_image");

                    $hasHeaderImage = false;

                    if ($headerImage instanceof File) {
                        $fileVersion = $headerImage->getApprovedVersion();

                        if ($fileVersion instanceof Version) {
                            $hasHeaderImage = true;

                            echo '<img src="' . $fileVersion->getURL() . '" alt="' . h(t("Header Image of %s", $profile->getUserName())) . '">';
                        }
                    }
                    ?>
                </div>

                <div class="profile-meta">
                    <div class="profile-image">
                        <div class="profile-image-actions">
                            <?php if (!$profile->getUserAvatar() instanceof EmptyAvatar) { ?>
                                <a href="<?php echo (string)Url::to("/account/edit_profile", "remove_avatar"); ?>"
                                   class="btn btn-danger btn-block">
                                    <?php echo t("Delete Image"); ?>
                                </a>
                            <?php } ?>

                            <form action="<?php echo (string)Url::to("/account/edit_profile", "upload_avatar"); ?>"
                                  method="post" enctype="multipart/form-data" id="ccm-upload-avatar">
                                <?php echo $token->output("upload_avatar"); ?>
                                <?php echo $form->file("avatar"); ?>
                                <?php echo $form->label("avatar", t("Change Photo"), ["class" => "btn btn-secondary btn-block"]); ?>
                            </form>
                        </div>

                        <div class="image-wrapper">
                            <?php echo $profile->getUserAvatar()->output(); ?>
                        </div>
                    </div>

                    <div class="clearfix"></div>

                    <form method="post" action="<?php /** @noinspection PhpUndefinedMethodInspection */
                    echo $view->action('save'); ?>" enctype="multipart/form-data" id="ccm-edit-profile-form">
                        <?php $token->output('profile_edit'); ?>

                        <h5>
                            <?php echo t("Information"); ?>
                        </h5>

                        <div class="row">
                            <div class="col-sm">
                                <div class="form-group row">
                                    <?php echo $form->label('uEmail', t('Email'), ["class" => "col-sm-4 col-form-label"]); ?>

                                    <div class="col-sm-8">
                                        <?php echo $form->text('uEmail', $profile->getUserEmail(), ["readonly" => "readonly"]); ?>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <?php echo $form->label('uName', t('Username'), ["class" => "col-sm-4 col-form-label"]); ?>

                                    <div class="col-sm-8">
                                        <?php echo $form->text('uName', $profile->getUserName()); ?>
                                    </div>
                                </div>

                                <?php if ($config->get('concrete.misc.user_timezones')) { ?>
                                    <div class="form-group row">
                                        <?php echo $form->label('uTimezone', t('Time Zone'), ["class" => "col-sm-4 col-form-label"]); ?>

                                        <div class="col-sm-8">
                                            <?php echo $form->select('uTimezone', $date->getTimezones(), ($profile->getUserTimezone() ? $profile->getUserTimezone() : date_default_timezone_get())); ?>
                                        </div>
                                    </div>
                                <?php } ?>

                                <?php if (is_array($locales) && count($locales)) { ?>
                                    <div class="form-group row">
                                        <?php echo $form->label('uDefaultLanguage', t('Language'), ["class" => "col-sm-4 col-form-label"]); ?>

                                        <div class="col-sm-8">
                                            <?php echo $form->select('uDefaultLanguage', $locales, Localization::activeLocale()); ?>
                                        </div>
                                    </div>
                                <?php } ?>

                                <?php if (is_array($attributeSets) && isset($attributeSets["Public Profile"])) { ?>

                                    <?php foreach ($attributeSets["Public Profile"] as $attributeKey) { ?>
                                        <?php /** @noinspection PhpUndefinedMethodInspection */
                                        $view = $profileFormRenderer->buildView($attributeKey);
                                        /** @var UserKey $attributeKey */
                                        if (in_array($attributeKey->getAttributeTypeHandle(), ["address", "boolean"])) {
                                            // hide the label for these attribute types
                                            /** @noinspection PhpUndefinedMethodInspection */
                                            $view->setSupportsLabel(false);
                                        }
                                        /** @noinspection PhpUndefinedMethodInspection */
                                        $view->setIsRequired($attributeKey->isAttributeKeyRequiredOnProfile());
                                        $view->render();
                                        ?>
                                    <?php } ?>
                                <?php } ?>
                            </div>

                            <?php if (is_array($attributeSets) && isset($attributeSets["Contact Information"])) { ?>
                                <div class="col-sm">
                                    <?php foreach ($attributeSets["Contact Information"] as $attributeKey) { ?>
                                        <?php /** @noinspection PhpUndefinedMethodInspection */
                                        $view = $profileFormRenderer->buildView($attributeKey);
                                        /** @var UserKey $attributeKey */
                                        if (in_array($attributeKey->getAttributeTypeHandle(), ["address", "boolean"])) {
                                            // hide the label for these attribute types
                                            /** @noinspection PhpUndefinedMethodInspection */
                                            $view->setSupportsLabel(false);
                                        }
                                        /** @noinspection PhpUndefinedMethodInspection */
                                        $view->setIsRequired($attributeKey->isAttributeKeyRequiredOnProfile());
                                        $view->render();
                                        ?>
                                    <?php } ?>

                                    <div class="offset-sm-4" style="margin-bottom: 25px">
                                        <a href="<?php echo Url::to("/account/edit_profile", "edit_forums_settings");?>" target="_blank">
                                            <?php echo t("Forum Email Settings"); ?>
                                        </a>
                                    </div>
                                </div>
                            <?php } ?>
                        </div>

                        <div class="float-right">
                            <a href="javascript:void(0);" class="btn btn-secondary" id="ccm-change-password">
                                <?php echo t("Change Password"); ?>
                            </a>

                            <button type="submit" class="btn btn-primary">
                                <?php echo t("Save Changes"); ?>
                            </button>
                        </div>

                        <div class="clearfix"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    (function ($) {
        $(function () {
            $("input[type=file]").change(function () {
                $(this).closest("form").submit();
            });
        });
    })(jQuery);
</script>