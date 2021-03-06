import datetime

from django.core.cache import cache
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import Avg, Max, Prefetch
from django.views.generic import View, DetailView, ListView, TemplateView

from .models import Station, Datapoint
from .api.views import StationViewSet
from .api.serializers import StationSerializer
from habhub.esp_instrument.models import Deployment
from habhub.ifcb_cruises.models import Cruise


######### AJAX Views to return geoJSON for maps #############
# AJAX views to get GeoJSON responses for all Stations map layer
class StationAjaxGetAllView(View):

    def get(self, request, *args, **kwargs):

        # Get the Station data from the DRF API
        stations_qs = Station.objects.all()
        start_date_obj = None
        end_date_obj = None

        if request.GET:
            start_date = request.GET.get('start_date')
            end_date = request.GET.get('end_date')

            if start_date:
                start_date_obj = datetime.datetime.strptime(start_date, '%m/%d/%Y').date()
            if end_date:
                end_date_obj = datetime.datetime.strptime(end_date, '%m/%d/%Y').date()

        if start_date_obj and end_date_obj:
            stations_qs = stations_qs.prefetch_related(Prefetch(
                'datapoints',
                queryset=Datapoint.objects.filter(measurement_date__range=[start_date_obj, end_date_obj])))

        stations_serializer = StationSerializer(
            stations_qs,
            many=True,
            context={'request': request, 'exclude_dataseries': True}
        )
        stations_list_json = stations_serializer.data

        return JsonResponse(stations_list_json)


# AJAX views to get GeoJSON responses for all Stations map layer
class StationAjaxGetChartView(View):

    def get(self, request, *args, **kwargs):
        station_id = self.kwargs['station_id']

        try:
            station_obj = Station.objects.get(id=station_id)
        except:
            station_obj = None

        print(station_obj)
        if station_obj:
            datapoints_qs = station_obj.datapoints.all()
            datapoint_series_data = list()

            for datapoint in datapoints_qs:
                date_str = datapoint.measurement_date.strftime('%Y-%m-%d')
                datapoint_series_data.append([date_str, float(datapoint.measurement)])

            x_axis = {
                'type': 'datetime',
            }

            y_axis = {
                'title': 'Shellfish meat toxicity',
                'min': 0,
                'softMax': 150,
                'plotLines': [{
                    'value': 80,
                    'color': 'red',
                    'dashStyle': 'shortdash',
                    'width': 2,
                    'label': {
                        'text': 'Closure threshold'
                    }
                }]
            }

            plot_options = {'series': {'threshold': 100}}

            datapoint_series = {
                'name': 'Shellfish meat toxicity',
                'data': datapoint_series_data,
            }

            chart = {
                'chart': {'type': 'spline'},
                'title': {'text': station_obj.station_location},
                'yAxis': y_axis,
                'xAxis': x_axis,
                'plotOptions': plot_options,
                #'plotOptions': plot_options,
                'series': [datapoint_series],
            }

        return JsonResponse(chart)


######### CBV Views for basic templates #############
class StationMapMainView(TemplateView):
    template_name = 'stations/stations_map_main.html'

    def get_context_data(self, **kwargs):
        context = super(StationMapMainView, self).get_context_data(**kwargs)
        # Get the earliest available notice date for the filter form
        datapoint_obj = Datapoint.objects.earliest()
        earliest_date = datapoint_obj.measurement_date.strftime("%m/%d/%Y")

        context.update({
            'earliest_date': earliest_date,
        })
        return context


class StationListView(ListView):
    model = Station
    template_name = 'stations/station_list.html'
    context_object_name = 'stations'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the ESP Deployments
        context['esp_deployments'] = Deployment.objects.all()
        # Add in a QuerySet of all the IFCB Cruises
        context['ifcb_cruises'] = Cruise.objects.all()
        return context
