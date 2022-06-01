<?php defined('C5_EXECUTE') or die('Access Denied.');

$c = Page::getCurrentPage();
$app = \Concrete\Core\Support\Facade\Application::getFacadeApplication();

$link = '';
$request = \Symfony\Component\HttpFoundation\Request::createFromGlobals();

if (isset($detailPage) && is_object($detailPage)) {
    $link = $detailPage->getCollectionLink();
    if ($request->query->has('infrastructure')) {
        $link .= '?infrastructure=' . $request->query->get('infrastructure');
    }
}

if ($entity) {

    try {
        $results = $result->getItemListObject()->getResults();
    } catch (\Exception $e) {
        $results = [];
    }

    if (count($results)) { ?>
    <style type="text/css">
     div.ccm-page .devops-page__title {
         color: #017DDD;
         font-size: 2.25rem;
         line-height: 64px;

         text-transform: uppercase;
     }
     div.ccm-page .card-devops__title {
         color: #2F3032 !important;
         text-transform: uppercase;
         font-size: 1.25rem;
     }

     div.ccm-page .card-devops__description {
         font-weight: 700;
         color: #017DDD;
     }
     .card-devops__cost {
         font-size: 3.75rem;
         color: #017DDD;
         line-height: 28px

     }
     .card-devops__cost--desktop {
         padding-top: 55px;
         padding-bottom: 60px;
     }
     @media (max-width: 1199px) {
         div.ccm-page .card-devops__cost--desktop {
             display: none;
         }
     }
     @media (min-width: 1200px) {
         div.ccm-page .card-devops__cost--mobile {
             display: none;
         }
     }

     .card-devops__cost-period {
         font-size: 1.25rem;
     }

     div.ccm-page .card-devops {
         border-radius: .25rem;
         border: .25rem solid transparent;
     }

     div.ccm-page .card-devops:hover {
         background-color: #F6F8FA;
         border-radius: .25rem;
         border: .25rem solid #017DDD;
         cursor: pointer;
     }
     .card-devops__footer {
         padding: 0;
         background-color: transparent;
         border-top: none;
     }

     div.ccm-page a.card-devops__choose-button {
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
     .card-devops__choose-button-text--selected {
         display: none;
     }
     div.ccm-page a.card-devops__choose-button--selected,
     div.ccm-page a.card-devops__choose-button--selected:hover {
         color: #FFFFFF !important;
         background-color: #017DDD !important;
     }
     div.ccm-page a.card-devops__choose-button--selected .card-devops__choose-button-text {
         display: none;
     }
     div.ccm-page a.card-devops__choose-button--selected .card-devops__choose-button-text--selected {
         display: contents;
     }

    </style>
    <div class="container devops-container">


        <div class="row">
            <div class="col-12">
                <h4 class="devops-page__title"><?=$entity->getName()?></h4>
            </div>
        </div>

        <?php foreach ($results as $result) {
            $cost = $result->getDevopsCost();
            $cost_is_numeric = is_numeric($cost);
            if ($cost_is_numeric) {
                $cost = number_format($cost);
            }
            $cost_format = ($cost_is_numeric) ? "+ $" : "";
            $cost_format .= "%s<span class=\"card-devops__cost-period\">";
            $cost_format .= ($cost_is_numeric) ? "/mo" : "";
            $cost_format .= "</span>";
            $cost = sprintf($cost_format, $cost);
        ?>



        <div class="card">
            <div class="card-body card-devops">


                <div class="row ">
                    <div class=" col-xl-3 col-sm-12 d-flex align-items-center"><!-- desktop cost -->
                        <div class="card-devops__cost--desktop">
                            <p class="card-text card-devops__cost"><?=$cost?></p>
                        </div>
                    </div>
                    <div class=" col-xl-6 offset-xl-0 col-md-8 offset-md-2 col-sm-12"><!-- description -->
                        <h5 class="card-devops__title"><?=$result->getDevopsName()?></h5>
                        <p class="card-devops__description"><?=$result->getDevopsDescription()?></p>
                        <div class="card-devops__content">
                            <?=$result->getDevopsContent()?>
                        </div>
                    </div>
                    <div class=" col-sm-12 col-md-8 offset-md-2 card-devops__cost--mobile py-3"><!-- mobile cost -->
                        <p class="card-text card-devops__cost text-center"><?=$cost?></p>
                    </div>
                    <div class=" col-xl-3 card-footer card-devops__footer d-flex align-items-center"><!-- button -->
                        <a href="<?=$link?>&amp;devops=<?=$result->getID()?>" class="btn card-devops__choose-button">
                            <span class="card-devops__choose-button-text"><?=t("Choose")?></span>
                            <span class="card-devops__choose-button-text--selected"><?=t("Selected")?></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
<?php } ?>

    </div>
    <script type="text/javascript" >
     $(".card-devops")
         .hover(function () {
             $(this)
                 .find("a.card-devops__choose-button")
                 .toggleClass("card-devops__choose-button--selected");
         })
         .on("click", function (e) {
             $target = $(e.target);
             if (!$target.hasClass("card-devops__choose-button--selected")) {
                 $target = $($(this).find("a.card-devops__choose-button"));
                 e.target = $target[0];
                 console.log({"$target[0]": $target[0], "e.target": e.target});
                 $target[0].click();
             }
         });
    </script>

    <?php } ?>


<?php } ?>
