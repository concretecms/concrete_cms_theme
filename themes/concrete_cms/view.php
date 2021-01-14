<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\View\View;

/** @var View $this */
/** @var array|ErrorList $error */
/** @var string $success */
/** @var string $message */
/** @var string $innerContent */

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
    </div>

    <?php
    echo $innerContent;
    ?>
</main>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer.php');
?>
