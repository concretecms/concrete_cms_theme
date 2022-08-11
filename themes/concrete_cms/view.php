<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\Area;
use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\Page\Page;
use Concrete\Core\View\View;

/** @var View $this */
/** @var array|ErrorList $error */
/** @var string $success */
/** @var string $message */
/** @var string $innerContent */

/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header.php');

?>

<main class="<?=isset($c) && $c->getCollectionHandle()?>">
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
        <?php
        if (isset($c)) {
            $view->inc('elements/page_header.php');
        }
        ?>
        <div class="row">
            <div class="col-sm-12">
                <?php
                echo $innerContent;
                ?>
            </div>
        </div>
    </div>
</main>

<?php if (isset($c)) { ?>
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
<?php } ?>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer.php');
?>
