<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

use Concrete\Core\Entity\Attribute\Value\Value\AddressValue;
use Concrete\Core\Entity\Attribute\Value\Value\SelectValue;
use Concrete\Core\Entity\Attribute\Value\Value\SelectValueOption;

defined('C5_EXECUTE') or die("Access Denied.");

/** @var string $title */
/** @var $attribute */
?>

    <h5>
        <?php echo $title; ?>
    </h5>

<?php if ($attribute === null || trim(str_replace("\n", "", $attribute)) == '') { ?>
    <p class="text-muted">
        <?php echo t("None Entered"); ?>
    </p>
<?php } else { ?>
    <p>
        <?php if ($attribute instanceof SelectValue) {
            foreach ($attribute->getSelectedOptions() as $selectedOption) {
                /** @var SelectValueOption $selectedOption */
                echo $selectedOption->getSelectAttributeOptionValue();
                echo "<br>";
            }
        } else if ($attribute instanceof AddressValue) {
            echo nl2br($attribute->getValue());
        } else {
            echo nl2br((string)$attribute);
        }
        ?>
    </p>
<?php } ?>