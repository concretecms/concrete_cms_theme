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
    <style>
     div.ccm-page .infrastructure-container {
         margin-bottom: 100px;
     }
     div.ccm-page .card-infrastructure {
         min-width: 280px;
     }
     .card-infrastructure .card-body,
     .card-infrastructure .card-footer {
         background: transparent;
     }

     div.ccm-page .infrastructure-page__title {
         color: #017DDD;
         font-size: 2.25rem;
         line-height: 64px;

         text-transform: uppercase;
     }
     .card-infrastructure__title {
         color: #2F3032 !important;
         text-transform: uppercase;
     }


     div.ccm-page .card-infrastructure {
         border-radius: .25rem;
         border: .25rem solid transparent;
     }

     div.ccm-page .card-infrastructure:hover {
         background-color: #F6F8FA;
         border-radius: .25rem;
         border: .25rem solid #017DDD;
         cursor: pointer;
     }

     .card-infrastructure__footer {
         padding: 0;
         padding-bottom: 50px;
         background-color: transparent;
         border-top: none;
     }

     .card-infrastructure__cost {
         font-size: 3.75rem;
         color: #017DDD;
         padding-top: 55px;
         padding-bottom: 60px;
         line-height: 28px

     }
     .card-infrastructure__cost-period {
         font-size: 1.25rem;
     }

     .card-infrastructure__content table {
         border: 0;
         padding-top: 12px;
         border-top: 1px solid #9797972C;
         width: 100%;
     }
     .card-infrastructure__content table tr:nth-of-type(1) td {
         padding-top: 7px;
     }
     .card-infrastructure__content table:nth-of-type(1) {
         border: none;
     }
     .card-infrastructure__content table:nth-of-type(1) tr:nth-of-type(1) td {
         padding-top: 0;
     }
     .card-infrastructure__content td {
         border: none;
     }
     .card-infrastructure__content table:nth-of-type(1) {
     }
     .card-infrastructure__content table td {
         padding-bottom: 10px;
         vertical-align: top;
     }

     .card-infrastructure__content table tr td:nth-of-type(1) {
         width: 66%;
     }
     .card-infrastructure__content table tr td:nth-of-type(2n) {
         font-weight: bold;
     }

     div.ccm-page a.card-infrastructure__choose-button {
         display: block;
         color: #19191A !important;
         font-size: 0.875rem;
         height: auto;
         line-height: 24px;
         margin: 0 auto;
         margin-top: 18px;
         padding-bottom: 8px;
         padding-top: 8px;
         width: 167px;
     }
     .card-infrastructure__choose-button-text--selected {
         display: none;
     }
     div.ccm-page a.card-infrastructure__choose-button--selected,
     div.ccm-page a.card-infrastructure__choose-button--selected:hover {
         color: #FFFFFF !important;
         background-color: #017DDD !important;
     }
     div.ccm-page a.card-infrastructure__choose-button--selected .card-infrastructure__choose-button-text {
         display: none;
     }
     div.ccm-page a.card-infrastructure__choose-button--selected .card-infrastructure__choose-button-text--selected {
         display: contents;
     }
    </style>
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
                 console.log({"$target[0]": $target[0], "e.target": e.target});
                 $target[0].click();
             }
         });
    </script>


    <?php } ?>


<?php } ?>
