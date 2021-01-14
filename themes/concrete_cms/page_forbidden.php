<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\View\View;

/** @var View $this */

/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header.php');

?>

<main>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>
                    <?php echo t('403 Error') ?>
                </h1>

                <p>
                    <?php echo t('You are not allowed to access this page.') ?>
                </p>
            </div>
        </div>
    </div>

</main>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer.php');
?>
