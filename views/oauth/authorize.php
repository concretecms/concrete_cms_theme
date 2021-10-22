<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied.');

use Concrete\Core\Authentication\AuthenticationType;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Entity\OAuth\Client;
use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\Form\Service\Form;
use Concrete\Core\Http\Request;
use Concrete\Core\Http\ResponseAssetGroup;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\Validation\CSRF\Token;
use Concrete\Core\View\View;
use League\OAuth2\Server\RequestTypes\AuthorizationRequest;

/** @var View $view */
/** @var ErrorList $error */
/** @var AuthorizationRequest $auth */
/** @var Request $request */
/** @var Client $client */
/** @var View $consentView */
/** @var bool $emailLogin */
/** @var bool $authorize */

$r = ResponseAssetGroup::get();
/** @noinspection PhpUnhandledExceptionInspection */
$r->requireAsset('javascript', 'underscore');
/** @noinspection PhpUnhandledExceptionInspection */
$r->requireAsset('javascript', 'core/events');

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Token $token */
$token = $app->make(Token::class);
/** @var Repository $config */
$config = $app->make(Repository::class);

if (isset($authType) && $authType) {
    $active = $authType;
    $activeAuths = array($authType);
} else {
    $active = null;
    $activeAuths = AuthenticationType::getList(true, true);
}
if (!isset($authTypeElement)) {
    $authTypeElement = null;
}
if (!isset($authTypeParams)) {
    $authTypeParams = null;
}

?>

<style>
    header, footer {
        display: none !important;
    }
</style>

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
                                <?php echo t("Welcome to our community. Join Concrete now. It's free!"); ?>
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

                        <form method="post" action="<?php echo $request->getUri() ?>" class="form-stacked">
                            <div class="row">
                                <div class="col">
                                    <?php if (!$authorize) { ?>
                                        <div class="form-group row">
                                            <?php echo $form->label("uName", $emailLogin ? t('Email Address') : t('Username'), ["class" => "col-sm-4 col-form-label"]); ?>

                                            <div class="col-sm-8">
                                                <?php echo $form->text("uName", ["autofocus" => "autofocus"]); ?>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <?php echo $form->label('uPassword', t('Password'), ["class" => "col-sm-4 col-form-label"]) ?>
                                            <div class="col-sm-8">
                                                <?php echo $form->password('uPassword') ?>
                                            </div>
                                        </div>

                                        <?php if (isset($locales) && is_array($locales) && count($locales) > 0) { ?>
                                            <div class="form-group row">
                                                <?php echo $form->label('USER_LOCALE', t('Language'), ["class" => "col-sm-4 col-form-label"]) ?>

                                                <div class="col-sm-8">
                                                    <?php echo $form->select('USER_LOCALE', $locales) ?>
                                                </div>
                                            </div>
                                        <?php } ?>

                                        <div class="form-group row">
                                            <label class="col-sm-3 col-form-label">
                                                &nbsp;
                                            </label>

                                            <div class="col-sm-9 text-right">
                                                <a href="<?=$_ENV['URL_SITE_COMMUNITY']?>/login/concrete/forgot_password" class="btn-link">
                                                    <?php echo t("Forgot Password"); ?>
                                                </a>
                                            </div>
                                        </div>

                                        <div class="float-right">

                                            <a href="<?php echo (string)Url::to("/"); ?>" class="btn btn-secondary">
                                                <?php echo t("Cancel"); ?>
                                            </a>

                                            <button class="btn btn-primary">
                                                <?php echo t('Sign in to %s', $client->getName()) ?>
                                            </button>
                                        </div>

                                        <div class="clearfix"></div>

                                        <?php $token->output('oauth_login_' . $client->getClientKey()); ?>

                                        <?php if ($config->get('concrete.user.registration.enabled')) { ?>
                                            <hr/>

                                            <div class="text-center sign-up-container">
                                                <?php echo t("Don't have an account?"); ?>

                                                <a href="<?php echo (string)Url::to('/register') ?>" class="btn btn-primary" style="margin-left: 15px;">
                                                    <?php echo t('Sign up'); ?>
                                                </a>
                                            </div>
                                        <?php } ?>

                                        <?php
                                    } elseif ($consentView) {
                                        $consentView->addScopeItems($view->getScopeItems());
                                        $consentView->setPackageHandle("concrete_cms_theme");
                                        echo $consentView->render();
                                    }
                                    ?>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
