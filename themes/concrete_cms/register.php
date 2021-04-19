<?php /** @noinspection PhpDeprecationInspection */

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied.');

use Concrete\Core\Attribute\Form\Renderer;
use Concrete\Core\Attribute\Form\RendererBuilder;
use Concrete\Core\Entity\Attribute\Key\UserKey;
use Concrete\Core\Captcha\CaptchaInterface;
use Concrete\Core\Form\Service\Form;
use Concrete\Core\Http\Request;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\View\View;
use Concrete\Core\Error\ErrorList\ErrorList;
use PortlandLabs\ConcreteCmsTheme\Attribute\Context\FrontendFormContext;

/** @var Renderer $renderer */
/** @var View $view */
/** @var View $this */
/** @var string $registerSuccess */
/** @var array $successMsg */
/** @var bool $displayUserName */
/** @var int $rcID */
/** @var array $attributeSets */
/** @var UserKey[] $unassignedAttributes */
/** @var array|ErrorList $error */
/** @var string $success */
/** @var string $message */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Repository $config */
$config = $app->make(Repository::class);
/** @var CaptchaInterface $captcha */
$captcha = $app->make(CaptchaInterface::class);
/** @var Request $request */
$request = $app->make(Request::class);

/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header_minimal.php');

$renderer->setContext(new FrontendFormContext());
?>

<div class="login-page">
    <main>
        <div class="fluid-container">
            <div class="login-wrapper">
                <div class="login-container">
                    <div class="row">
                        <div class="col-md col-sm-12 ccm-logo-column">
                            <img src="<?php echo $this->getThemePath() . "/images/logo.svg"; ?>"
                                 alt="<?php echo h(t("concreteCMS Logo")); ?>" class="ccm-logo">
                        </div>

                        <div class="col-md col-sm-12">
                            <h1 class="ccm-title">
                                <?php echo t("Welcome to our community.  Join Concrete now. It’s free!"); ?>
                            </h1>
                        </div>
                    </div>

                    <div class="container login-content">
                        <div class="row">
                            <div class="col">
                                <?php
                                /** @noinspection PhpUnhandledExceptionInspection */
                                View::element('system_errors', [
                                    'format' => 'block',
                                    'error' => isset($error) ? $error : null,
                                    'success' => isset($success) ? $success : null,
                                    'message' => isset($message) ? $message : null,
                                ], "concrete_cms_theme"); ?>
                            </div>
                        </div>

                        <?php if (!empty($registerSuccess)) { ?>
                            <div class="row">
                                <div class="col">
                                    <?php switch ($registerSuccess) { ?>
<?php case 'registered': ?>
                                            <p>
                                                <strong>
                                                    <?php echo $successMsg; ?>
                                                </strong>

                                                <br/><br/>
                                                <a href="<?php echo $view->url('/'); ?>">
                                                    <?php echo t('Return to Home'); ?>
                                                </a>
                                            </p>

                                            <?php break; ?>

                                        <?php case 'validate': ?>
                                            <p>
                                                <?php echo $successMsg[0]; ?>
                                            </p>

                                            <p>
                                                <?php echo $successMsg[1]; ?>
                                            </p>

                                            <p>
                                                <a href="<?php echo $view->url('/'); ?>">
                                                    <?php echo t('Return to Home'); ?>
                                                </a>
                                            </p>

                                            <?php break; ?>

                                        <?php case 'pending': ?>
                                            <p>
                                                <?php echo $successMsg; ?>
                                            </p>

                                            <p>
                                                <a href="<?php echo $view->url('/'); ?>">
                                                    <?php echo t('Return to Home'); ?>
                                                </a>
                                            </p>

                                            <?php break; ?>

                                        <?php } ?>
                                </div>
                            </div>
                        <?php } else { ?>
                            <form method="post" action="<?php echo $view->url('/register', 'do_register'); ?>"
                                  class="form-stacked">
                                <?php $token->output('register.do_register'); ?>

                                <div class="row">
                                    <div class="col">
                                        <fieldset>
                                            <?php if ($displayUserName) { ?>
                                                <div class="form-group row">
                                                    <?php echo $form->label('uName', t('Username'), ["class" => "col-sm-4 col-form-label"]); ?>

                                                    <div class="col-sm-8">
                                                        <?php echo $form->text('uName'); ?>
                                                    </div>
                                                </div>
                                            <?php } ?>

                                            <div class="form-group row">
                                                <?php echo $form->label('uEmail', t('Email Address'), ["class" => "col-sm-4 col-form-label"]); ?>

                                                <div class="col-sm-8">
                                                    <?php echo $form->text('uEmail'); ?>
                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <?php echo $form->label('uPassword', t('Password'), ["class" => "col-sm-4 col-form-label"]); ?>

                                                <div class="col-sm-8">
                                                    <?php echo $form->password('uPassword', ['autocomplete' => 'off']); ?>
                                                </div>
                                            </div>

                                            <?php if ($config->get('concrete.user.registration.display_confirm_password_field')) { ?>
                                                <div class="form-group row">
                                                    <?php echo $form->label('uPasswordConfirm', t('Confirm Password'), ["class" => "col-sm-4 col-form-label"]); ?>

                                                    <div class="col-sm-8">
                                                        <?php echo $form->password('uPasswordConfirm', ['autocomplete' => 'off']); ?>
                                                    </div>
                                                </div>
                                            <?php } ?>
                                        </fieldset>
                                    </div>
                                </div>

                                <?php if (!empty($attributeSets)) { ?>
                                    <div class="row">
                                        <div class="col">
                                            <?php foreach ($attributeSets as $setName => $attibutes) { ?>
                                                <fieldset>
                                                    <?php /** @var UserKey[] $attibutes */ ?>

                                                    <?php foreach ($attibutes as $attributeKey) {
                                                        /** @noinspection PhpUndefinedMethodInspection */
                                                        $view = $renderer->buildView($attributeKey);
                                                        /** @var UserKey $attributeKey */
                                                        if (in_array($attributeKey->getAttributeTypeHandle(), ["address", "boolean"])) {
                                                            // hide the label for these attribute types
                                                            /** @noinspection PhpUndefinedMethodInspection */
                                                            $view->setSupportsLabel(false);
                                                        }
                                                        /** @noinspection PhpUndefinedMethodInspection */
                                                        $view->setIsRequired($attributeKey->isAttributeKeyRequiredOnProfile());
                                                        $view->render();
                                                    } ?>
                                                </fieldset>
                                            <?php } ?>
                                        </div>
                                    </div>
                                <?php } ?>

                                <?php if (!empty($unassignedAttributes)) { ?>
                                    <div class="row">
                                        <div class="col">
                                            <fieldset>
                                                <?php foreach ($unassignedAttributes as $attributeKey) {
                                                     /** @noinspection PhpUndefinedMethodInspection */
                                        $view = $renderer->buildView($attributeKey);
                                        /** @var UserKey $attributeKey */
                                        if (in_array($attributeKey->getAttributeTypeHandle(), ["address", "boolean"])) {
                                            // hide the label for these attribute types
                                            /** @noinspection PhpUndefinedMethodInspection */
                                            $view->setSupportsLabel(false);
                                        }
                                        /** @noinspection PhpUndefinedMethodInspection */
                                        $view->setIsRequired($attributeKey->isAttributeKeyRequiredOnProfile());
                                        $view->render();
                                                } ?>
                                            </fieldset>
                                        </div>
                                    </div>
                                <?php } ?>

                                <?php if ($config->get('concrete.user.registration.captcha')) { ?>
                                    <div class="row">
                                        <div class="col offset-sm-4">
                                            <div class="form-group">
                                                <?php echo $captcha->label(); ?>

                                                <?php
                                                $captcha->showInput();
                                                $captcha->display();
                                                ?>
                                            </div>
                                        </div>
                                    </div>
                                <?php } ?>

                                <div class="row">
                                    <div class="col">
                                        <div class="float-right">
                                            <?php echo $form->hidden('rcID', isset($rcID) ? $rcID : ''); ?>

                                            <a href="<?php echo (string)Url::to("/"); ?>" class="btn btn-secondary">
                                                <?php echo t("Cancel"); ?>
                                            </a>

                                            <button type="submit" name="register" class="btn btn-primary">
                                                <?php echo t("Create Account"); ?>
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <hr/>

                                <div class="text-center sign-up-container">
                                    <?php echo t("Already have an account?"); ?>

                                    <a href="<?php echo (string)Url::to('/login'); ?>" class="btn-link">
                                        <?php echo t('Sign in'); ?>
                                    </a>
                                </div>
                            </form>
                        <?php } ?>
                    </div>

                </div>
            </div>
        </div>
    </main>
</div>
<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer_minimal.php');
?>
