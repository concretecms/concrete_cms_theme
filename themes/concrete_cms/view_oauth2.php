<?php

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\View\View;

/** @var View $this */
/** @var array|ErrorList $error */
/** @var string $success */
/** @var string $message */
/** @var string $innerContent */

/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header_minimal.php');


?>

<div class="concrete-cms-theme-login-page">
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
                    <div class="row">
                        <div class="col-sm-12">
                            <?php
                                echo $innerContent;
                            ?>
                        </div>
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
