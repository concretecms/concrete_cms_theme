<?php defined('C5_EXECUTE') or die('Access denied.');
$form = Core::make('helper/form');
$dh = Core::make('helper/date');  /* @var $dh \Concrete\Core\Localization\Service\Date */
/* @var Concrete\Core\Form\Service\Form $form */
?>

<form class="concrete-login-form" method="post" action="<?= URL::to('/login', 'authenticate', $auth->getAuthenticationTypeHandle()); ?>">

    <div class="form-group row mb-3">
        <label class="col-sm-3 col-form-label" for="uName">
            <?=Config::get('concrete.user.registration.email_registration') ? t('Email Address') : t('User Name'); ?>
        </label>
        <div class="col-sm-9">
            <input name="uName" id="uName" class="form-control" autofocus="autofocus" />
        </div>
    </div>
    <div class="form-group row mb-3">
        <label class="col-sm-3 col-form-label" for="uPassword">
            <?=t('Password'); ?>
        </label>
        <div class="col-sm-9">
            <input name="uPassword" id="uPassword" class="form-control" type="password" autocomplete="off" />
        </div>
    </div>
    <div class="form-group row mb-3">
        <label class="col-sm-3 col-form-label" for="uPassword">
        </label>
        <div class="col-sm-9 text-end">
            <a href="<?= URL::to('/login', 'concrete', 'forgot_password'); ?>" class="btn-link"><?= t('Forgot Password'); ?></a>
        </div>
    </div>
    <?php if (Config::get('concrete.session.remember_me.lifetime') > 0) {
    ?>
    <div class="form-group row mb-3">
        <div class="col-sm-3 col-form-label pt-0"><?=t('Remember Me'); ?></div>
        <div class="col-sm-9">
            <div class="form-check ms-auto">
                <input class="form-check-input" type="checkbox" id="uMaintainLogin" name="uMaintainLogin" value="1">
                <label class="form-check-label form-check-remember-me" for="uMaintainLogin">
                    <?php echo t('Stay signed in for %s', $dh->describeInterval(Config::get('concrete.session.remember_me.lifetime'))); ?>
                </label>
            </div>
        </div>
    </div>
    <?php
} ?>
    <?php if (isset($locales) && is_array($locales) && count($locales) > 0) {
        ?>

        <div class="form-group row mb-3">
            <div class="col-sm-3 col-form-label pt-0"><?=t('Language'); ?></div>
            <div class="col-sm-9">
                <?= $form->select('USER_LOCALE', $locales); ?>
            </div>
        </div>

    <?php
    } ?>
    <div class="mb-3 row">
        <div class="col-sm-12 text-end">
            <a href="<?= \URL::to('/'); ?>" class="btn btn-secondary"> <?= t('Cancel'); ?> </a>
            <button class="btn btn-primary"><?= t('Sign In'); ?></button>
            <?php Core::make('helper/validation/token')->output('login_' . $auth->getAuthenticationTypeHandle()); ?>
        </div>
    </div>

    <?php if (Config::get('concrete.user.registration.enabled')) {
        ?>
        <hr class="mt-5">
        <div class="text-center sign-up-container mt-5">
            <?=t("Don't have an account?"); ?>
            <a href="<?=URL::to('/register'); ?>"><?=t('Sign up'); ?></a>
        </div>
    <?php
    } ?>
</form>
