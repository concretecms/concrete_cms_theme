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
use HtmlObject\Element;
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

                            echo (string) new Element("div", null,[
                                "class" => "image-container",
                                "style" => "background-image: url('" . h($fileVersion->getURL()) . "');"
                            ]);
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
                                <div class="mb-3 row">
                                    <?php echo $form->label('uEmail', t('Email'), ["class" => "col-sm-4 col-form-label"]); ?>

                                    <div class="col-sm-8">
                                        <?php echo $form->text('uEmail', $profile->getUserEmail(), ["readonly" => "readonly"]); ?>
                                    </div>
                                </div>

                                <div class="mb-3 row">
                                    <?php echo $form->label('uName', t('Username'), ["class" => "col-sm-4 col-form-label"]); ?>

                                    <div class="col-sm-8">
                                        <?php echo $form->text('uName', $profile->getUserName()); ?>
                                    </div>
                                </div>

                                <?php if ($config->get('concrete.misc.user_timezones')) { ?>
                                    <div class="mb-3 row">
                                        <?php echo $form->label('uTimezone', t('Time Zone'), ["class" => "col-sm-4 col-form-label"]); ?>

                                        <div class="col-sm-8">
                                            <?php echo $form->select('uTimezone', $date->getTimezones(), ($profile->getUserTimezone() ? $profile->getUserTimezone() : date_default_timezone_get())); ?>
                                        </div>
                                    </div>
                                <?php } ?>

                                <?php if (is_array($locales) && count($locales)) { ?>
                                    <div class="mb-3 row">
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
                                </div>
                            <?php } ?>
                        </div>

                        <div class="float-end">
                            <button type='button' data-bs-toggle="modal" data-bs-target="#passwordchange" class="btn btn-secondary" id="ccm-change-password">
                                <?php echo t("Change Password"); ?>
                            </button>

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

<div class="modal" id="passwordchange" tabindex="-1" role="dialog">
    <div class="modal-dialog shadow" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Change Password</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="<?= $updatePasswordAction ?>">
                <?= $token->output('update_password', true); ?>
                <div class="alert alert-warning d-none"></div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="currentPassword">Current Password</label>
                        <input required type="password" class="form-control" id="currentPassword" placeholder="Current Password" name="currentPassword" autocomplete="current-password">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">New Password</label>
                        <input required type="password" class="form-control" id="exampleInputPassword1" placeholder="New Password" name="password" autocomplete="new-password">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Repeat Password</label>
                        <input required type="password" class="form-control" id="exampleInputPassword1" placeholder="Repeat Password" name="password2" autocomplete="new-password">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-role="submit">Change Password</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</div>
<script>
    (function ($) {
        $(function () {
            $("input[type=file]").change(function () {
                $(this).closest("form").submit();
                showError('', [])
            });

            const container = $('#passwordchange');
            const error = container.find('.alert');
            const showSuccess = function(message) {
                error.addClass('alert-success').removeClass('alert-warning')
                error.text(message).removeClass('d-none')
            }

            const showError = function(message, requirements) {
                error.html('')
                error.removeClass('alert-success').addClass('alert-warning')
                if (message) {
                    if (typeof message === 'object') {
                        for (let text of message) {
                            error.append($(document.createElement('span')).addClass('d-block').text(text));
                        }
                        error.removeClass('d-none')
                    } else {
                        error.text(message).removeClass('d-none')
                    }

                    let ul = $(document.createElement('ul')).addClass('mb-0');
                    for (let text of requirements) {
                        ul.append($(document.createElement('li')).text(text));
                    }
                    error.append(ul)
                } else {
                    error.text('').addClass('d-none')
                }
            }

            const handleResult = function(result) {
                console.log(result)
                if (result.error) {
                    showError(result.message, result.requirements)

                    container.find('.is-invalid').removeClass('is-invalid')
                    for (let field of result.fields) {
                        container.find('[name=' + field + ']').addClass('is-invalid');
                    }
                } else {
                    showSuccess('Password updated successfully.');
                    container.find('input').not('[name=ccm_token]').val('');
                }
            }

            container.on('shown.bs.modal', function () {
                container.find('[name=currentPassword]').trigger('focus');
                container.find('input').not('[name=ccm_token]').val('');
            });

            container.find('[data-role=submit]').click(function() {
                const form = $(this).closest('form')
                const data = form.serializeArray();

                showError('', [])
                container.find('.is-invalid').removeClass('is-invalid')
                $.post(form.attr('action'), data, null, 'json').then(function(result) {
                    if (typeof result === 'object') {
                        handleResult(result)
                    } else {
                        showError('Unknown error: Invalid response.')
                    }
                }, function(response, type, reason) {
                    if (typeof response.responseJSON === 'object') {
                        handleResult(response.responseJSON)
                    } else {
                        showError('Unknown error: ' + reason)
                    }
                })
            });
        });
    })(jQuery);
</script>
