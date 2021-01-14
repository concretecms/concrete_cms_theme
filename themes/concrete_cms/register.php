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
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\View\View;
use Concrete\Core\Error\ErrorList\ErrorList;

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

/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header.php');
?>

<main>
    <div class="container">
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
            <form method="post" action="<?php echo $view->url('/register', 'do_register'); ?>" class="form-stacked">
                <?php $token->output('register.do_register'); ?>

                <div class="row">
                    <div class="col">
                        <fieldset>
                            <legend>
                                <?php echo t('Your Details'); ?>
                            </legend>

                            <?php if ($displayUserName) { ?>
                                <div class="form-group">
                                    <?php echo $form->label('uName', t('Username')); ?>
                                    <?php echo $form->text('uName'); ?>
                                </div>
                            <?php } ?>

                            <div class="form-group">
                                <?php echo $form->label('uEmail', t('Email Address')); ?>
                                <?php echo $form->text('uEmail'); ?>
                            </div>

                            <div class="form-group">
                                <?php echo $form->label('uPassword', t('Password')); ?>
                                <?php echo $form->password('uPassword', ['autocomplete' => 'off']); ?>
                            </div>

                            <?php if ($config->get('concrete.user.registration.display_confirm_password_field')) { ?>
                                <div class="form-group">
                                    <?php echo $form->label('uPasswordConfirm', t('Confirm Password')); ?>
                                    <?php echo $form->password('uPasswordConfirm', ['autocomplete' => 'off']); ?>
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
                                    <legend>
                                        <?php echo $setName; ?>
                                    </legend>

                                    <?php /** @var UserKey[] $attibutes */ ?>

                                    <?php foreach ($attibutes as $ak) {
                                        /** @var RendererBuilder $rendererBuilder */
                                        $rendererBuilder = $renderer->buildView($ak);
                                        /** @noinspection PhpUndefinedMethodInspection */
                                        $rendererBuilder->setIsRequired($ak->isAttributeKeyRequiredOnRegister());
                                        $rendererBuilder->render();
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
                                <legend>
                                    <?php echo t('Other'); ?>
                                </legend>

                                <?php foreach ($unassignedAttributes as $ak) {
                                    /** @var RendererBuilder $rendererBuilder */
                                    $rendererBuilder = $renderer->buildView($ak);
                                    /** @noinspection PhpUndefinedMethodInspection */
                                    $rendererBuilder->setIsRequired($ak->isAttributeKeyRequiredOnRegister());
                                    $rendererBuilder->render();
                                } ?>
                            </fieldset>
                        </div>
                    </div>
                <?php } ?>

                <?php if ($config->get('concrete.user.registration.captcha')) { ?>
                    <div class="row">
                        <div class="col">
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

                            <button type="submit" name="register" class="btn btn-primary">
                                <?php echo t("Register"); ?>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        <?php } ?>
    </div>
</main>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer.php');
?>
