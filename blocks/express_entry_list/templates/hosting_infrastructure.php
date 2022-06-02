<?php defined('C5_EXECUTE') or die('Access Denied.');

$c = Page::getCurrentPage();
$app = \Concrete\Core\Support\Facade\Application::getFacadeApplication();

$link = '';
if (isset($detailPage) && is_object($detailPage)) {
    $link = $detailPage->getCollectionLink();
}

if ($entity) {

    try {
        $results = $result->getItemListObject()->getResults();
    } catch (\Exception $e) {
        $results = [];
    }

    if (count($results)) { ?>
    <div class="container infrastructure-container">

        <div class="row">
            <div class="col-12">
                <h4 class="infrastructure-page__title"><?=$entity->getName()?></h4>
            </div>
        </div>

        <div class="card-deck">
            <div class="row row-cols-sm-2 row-cols-xl-4">

                <?php foreach ($results as $result) {
                    $cost = $result->getInfrastructureCost();
                    $cost_is_numeric = is_numeric($cost);
                    if ($cost_is_numeric) {
                        $cost = number_format($cost);
                    }
                    $cost_format = ($cost_is_numeric) ? "$" : "";
                    $cost_format .= "%s<span class=\"card-infrastructure__cost-period\">";
                    $cost_format .= ($cost_is_numeric) ? "/mo" : "";
                    $cost_format .= "</span>";
                    $cost = sprintf($cost_format, $cost);
                ?>

                <div class="col mb-4">
                    <div class="card card-infrastructure h-100">

                        <div class="card-body">
                            <h5 class="card-infrastructure__title"><?=$result->getInfrastructureName()?></h5>
                            <p class="card-text card-infrastructure__cost"><?=$cost?></p>
                            <div class="card-infrastructure__content">
                                <?=$result->getInfrastructureContent()?>
                            </div>
                        </div>

                        <div class="card-footer card-infrastructure__footer">
                            <a href="<?=$link?>?infrastructure=<?=$result->getID()?>" class="btn card-infrastructure__choose-button">
                                <span class="card-infrastructure__choose-button-text"><?=t("Choose")?></span>
                                <span class="card-infrastructure__choose-button-text--selected"><?=t("Selected")?></span>
                            </a>
                        </div>

                    </div>
                </div>

<?php } ?>

            </div>
        </div>
    </div>
    <script type="text/javascript" >
     $(".card-infrastructure")
         .hover(function () {
             $(this)
                 .find("a.card-infrastructure__choose-button")
                 .toggleClass("card-infrastructure__choose-button--selected");
         })
         .on("click", function (e) {
             $target = $(e.target);
             if (!$target.hasClass("card-infrastructure__choose-button--selected")) {
                 $target = $($(this).find("a.card-infrastructure__choose-button"));
                 e.target = $target[0];
                 $target[0].click();
             }
         });
    </script>

    <?php } ?>
<?php } ?>
