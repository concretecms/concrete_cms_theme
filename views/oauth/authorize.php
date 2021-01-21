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

<div class="login-page">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1>
                    <?php echo t('Sign in to %s', $client->getName()) ?>
                </h1>

                <form method="post" action="<?php echo $request->getUri() ?>">
                    <?php if (!$authorize) { ?>
                        <div class="form-group">
                            <?php echo $form->label("uName", $emailLogin ? t('Email Address') : t('Username')); ?>
                            <?php echo $form->text("uName", ["autofocus" => "autofocus"]); ?>
                        </div>

                        <div class="form-group">
                            <?php echo $form->label('uPassword', t('Password')) ?>
                            <?php echo $form->password('uPassword') ?>
                        </div>

                        <?php if (isset($locales) && is_array($locales) && count($locales) > 0) { ?>
                            <div class="form-group">
                                <?php echo $form->label('USER_LOCALE', t('Language')) ?>
                                <?php echo $form->select('USER_LOCALE', $locales) ?>
                            </div>
                        <?php } ?>

                        <div class="form-group">
                            <button class="btn btn-primary">
                                <?php echo t('Log in') ?>
                            </button>
                        </div>

                        <?php $token->output('oauth_login_' . $client->getClientKey()); ?>

                        <?php if ($config->get('concrete.user.registration.enabled')) { ?>
                            <hr/>
                            <a href="<?php echo (string)Url::to('/register') ?>" class="btn btn-block btn-success"
                               target="_blank">
                                <?php echo t('Not a member? Register') ?>
                            </a>
                        <?php } ?>

                        <?php
                    } elseif ($consentView) {
                        $consentView->addScopeItems($view->getScopeItems());
                        $consentView->setPackageHandle("concrete_cms_theme");
                        echo $consentView->render();
                    }
                    ?>
                </form>
            </div>
        </div>
    </div>
</div>
