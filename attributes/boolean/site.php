<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Utility\Service\Identifier;

$app = Application::getFacadeApplication();
/** @var Identifier $idHelper */
$idHelper = $app->make(Identifier::class);

$controlId = "ccm-checkbox-" . $idHelper->getString();
?>

<div class="offset-sm-4">
    <div class="form-group">
        <div class="form-check">
            <input
                    type="checkbox"
                    value="1"
                    id="<?php echo $controlId; ?>"
                    class="form-check-input"
                    name="<?php echo $view->field('value') ?>"
                <?php if ($checked) { ?> checked <?php } ?>
            >
            <label for="<?php echo $controlId; ?>" class="form-check-label">
                <?php echo $controller->getCheckboxLabel() ?>
            </label>
        </div>
    </div>
</div>