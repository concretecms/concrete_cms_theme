<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

/* @var Concrete\Attribute\Address\Controller $controller */
/* @var Concrete\Core\Attribute\View $view */
/* @var Concrete\Core\Attribute\View $this */

/* @var Concrete\Core\Entity\Attribute\Key\UserKey $key */

/* @var Concrete\Core\Form\Service\Form $form */
/* @var Concrete\Core\Localization\Service\CountryList $lists_countries */

/* @var string $address1 */
/* @var string $address2 */
/* @var string $city */
/* @var string $state_province */
/* @var string $country */
/* @var string $postal_code */

/* @var int $akID */
/* @var array $akCustomCountries */
/* @var string $akDefaultCountry */
/* @var bool $akGeolocateCountry */
/* @var bool $akHasCustomCountries */
/* @var bool $search */

$addressId = uniqid('ccm_attribute_address_', true);

?>

<div id="<?php echo $addressId; ?>"
     class="ccm-attribute-address-composer-wrapper ccm-attribute-address-<?php echo $key->getAttributeKeyID(); ?>">

    <div class="mb-3 row">
        <?php echo $form->label($this->field('address1'), t('Address 1'), ["class" => "col-sm-4 col-form-label"]); ?>

        <div class="col-sm-8">
            <?php echo $form->text($this->field('address1'), $address1); ?>
        </div>
    </div>

    <div class="mb-3 row">
        <?php echo $form->label($this->field('address2'), t('Address 2'), ["class" => "col-sm-4 col-form-label"]); ?>

        <div class="col-sm-8">
            <?php echo $form->text($this->field('address2'), $address2); ?>
        </div>
    </div>

    <div class="mb-3 row">
        <?php echo $form->label($this->field('city'), t('City'), ["class" => "col-sm-4 col-form-label"]); ?>

        <div class="col-sm-8">
            <?php echo $form->text($this->field('city'), $city); ?>
        </div>
    </div>

    <?php
    if (!$country && !$search) {
        if ($akDefaultCountry != '') {
            $country = $akDefaultCountry;
        }
    }
    ?>

    <div class="mb-3 row ccm-attribute-address-line ccm-attribute-address-country">
        <?php echo $form->label($this->field('country'), t('Country'), ["class" => "col-sm-4 col-form-label"]); ?>

        <div class="col-sm-8">
            <?php echo $form->selectCountry($this->field('country'), $country, [
                'allowedCountries' => $akHasCustomCountries ? $akCustomCountries : null,
                'linkStateProvinceField' => true,
                'hideUnusedStateProvinceField' => true,
                'clearStateProvinceOnChange' => true,
            ]); ?>
        </div>
    </div>

    <div class="mb-3 row ccm-attribute-address-line ccm-attribute-address-state-province"
         data-countryfield="<?php echo $this->field('country'); ?>">
        <?php echo $form->label($this->field('state_province'), t('State/Province'), ["class" => "col-sm-4 col-form-label"]); ?>

        <div class="col-sm-8">
            <?php echo $form->text($this->field('state_province'), $state_province); ?>
        </div>
    </div>

    <div class="mb-3 row ccm-attribute-address-line">
        <?php echo $form->label($this->field('postal_code'), t('Postal Code'), ["class" => "col-sm-4 col-form-label"]); ?>

        <div class="col-sm-8">
            <?php echo $form->text($this->field('postal_code'), $postal_code); ?>
        </div>
    </div>

</div>
