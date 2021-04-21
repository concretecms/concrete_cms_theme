<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied.');

use Concrete\Core\Area\Area;
use Concrete\Core\Attribute\Key\Key;
use Concrete\Core\Authentication\AuthenticationType;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Form\Service\Form;
use /** @noinspection PhpDeprecationInspection */
    Concrete\Core\Form\Service\Widget\Attribute;
use Concrete\Core\Html\Service\Navigation;
use Concrete\Core\Http\Request;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\User\User;
use Concrete\Core\View\View;
use Concrete\Core\Error\ErrorList\ErrorList;

/** @var User $user */
/** @var string $authType */
/* @var Key[] $required_attributes */
/** @var View $this */
/** @var array|ErrorList $error */
/** @var string $success */
/** @var string $message */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Navigation $navHelper */
$navHelper = $app->make(Navigation::class);
/** @var Repository $config */
$config = $app->make(Repository::class);
/** @var Request $request */
$request = $app->make(Request::class);

if (isset($authType) && $authType) {
    $active = $authType;
    $activeAuths = [$authType];
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


$hasRequiredAttributes = (isset($required_attributes) && count($required_attributes));

// See if we have a user object and if that user is registered
$loggedIn = !$hasRequiredAttributes && isset($user) && $user->isRegistered();
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header_minimal.php');

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
                                <?php echo t("Welcome to our community. Join Concrete now. It’s free!"); ?>
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

                        <?php if ($hasRequiredAttributes) { ?>
                            <?php /** @noinspection PhpDeprecationInspection */
                            $attribute_helper = new Attribute(); ?>

                            <div class="row login-page-content attribute-mode">
                                <form action="<?php echo (new View)->action('fill_attributes'); ?>" method="post">
                                    <div data-handle="required_attributes"
                                         class="authentication-type authentication-type-required-attributes">

                                        <div class="ccm-required-attribute-form">
                                            <?php foreach ($required_attributes as $key) {
                                                echo $attribute_helper->display($key, true);
                                            } ?>
                                        </div>

                                        <div class="form-group">
                                            <button class="btn btn-primary pull-right">
                                                <?php echo t('Submit'); ?>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        <?php } else { ?>
                            <div class="row login-page-content">
                                <div class="col-12">
                                    <?php if ($loggedIn) { ?>
                                        <div class="text-center">
                                            <h2>
                                                <?php echo t('You are already logged in.'); ?>
                                            </h2>

                                            <?php echo $navHelper->getLogInOutLink(); ?>
                                        </div>

                                    <?php } else { ?>
                                        <?php $i = 0; ?>

                                        <?php foreach ($activeAuths as $auth) { ?>
                                            <div data-handle="<?php echo $auth->getAuthenticationTypeHandle(); ?>"
                                                 class="authentication-type authentication-type-<?php echo $auth->getAuthenticationTypeHandle(); ?>">
                                                <?php $auth->renderForm($authTypeElement ?: 'form', $authTypeParams ?: []); ?>
                                            </div>

                                            <?php if ($i == 0 && count($activeAuths) > 1 && $config->get('concrete.user.registration.enabled')) { ?>
                                                <div class="text-center" style="color: #ffffff; margin-bottom: 15px;">
                                                    <?php echo t('or'); ?>
                                                </div>
                                            <?php } elseif ($i == 0 && count($activeAuths) > 1) { ?>
                                                <?php echo '<hr>'; ?>
                                            <?php } ?>

                                            <?php ++$i; ?>
                                        <?php } ?>
                                    <?php } ?>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<section class="additional-content">
    <?php
    $a = new Area('Main');
    $a->enableGridContainer();
    $a->display($c);

    // Render additional areas if required
    for ($i = 1; $i <= (int)$c->getAttribute('main_area_number'); $i++) {
        $a = new Area('Main ' . $i);
        $a->enableGridContainer();
        $a->display($c);
    }
    ?>
</section>
</div>
<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer_minimal.php');
